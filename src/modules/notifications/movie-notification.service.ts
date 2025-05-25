import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { EmailService } from '../email/email.service'

@Injectable()
export class MovieNotificationService {
  private readonly logger = new Logger(MovieNotificationService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async subscribeUserToMovieNotification(userId: string, movieId: string) {
    return this.prisma.userMovieNotification.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { notified: false },
      create: { userId, movieId, notified: false },
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleNotifications() {
    this.logger.log(
      'Iniciando envio de notificações para filmes lançados hoje...',
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const moviesReleasedToday = await this.prisma.movie.findMany({
      where: {
        releaseDate: today,
      },
    })

    for (const movie of moviesReleasedToday) {
      const notifications = await this.prisma.userMovieNotification.findMany({
        where: {
          movieId: movie.id,
          notified: false,
        },
        include: {
          user: true,
        },
      })

      for (const notification of notifications) {
        try {
          await this.emailService.sendMovieAvailableEmail(
            notification.user.email,
            movie.title,
            `https://host.com/movies/${movie.slug}`,
          )
          await this.prisma.userMovieNotification.update({
            where: { id: notification.id },
            data: { notified: true },
          })
          this.logger.log(
            `Email enviado para ${notification.user.email} sobre o filme ${movie.title}`,
          )
        } catch (error) {
          this.logger.error(
            `Erro enviando email para ${notification.user.email}: ${error}`,
          )
        }
      }
    }

    this.logger.log('Envio de notificações finalizado.')
  }

  async unsubscribeUserFromMovieNotification(userId: string, movieId: string) {
    await this.prisma.userMovieNotification.deleteMany({
      where: { userId, movieId },
    })
  }
}
