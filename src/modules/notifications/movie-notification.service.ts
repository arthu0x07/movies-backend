import { PrismaService } from '@/database/prisma/prisma.service'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger as WinstonLogger } from 'winston'
import { EmailService } from '../email/email.service'

@Injectable()
export class MovieNotificationService {
  private readonly logger = new Logger(MovieNotificationService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: WinstonLogger,
  ) {}

  async subscribeUserToMovieNotification(userId: string, movieId: string) {
    return this.prisma.userMovieNotification.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { notified: false },
      create: { userId, movieId, notified: false },
    })
  }

  async createNotificationForFutureMovie(userId: string, movieId: string) {
    this.winstonLogger.info('Creating automatic notification subscription', {
      service: 'MovieNotificationService',
      action: 'createNotificationForFutureMovie',
      userId,
      movieId,
    })
    
    try {
      const notification = await this.prisma.userMovieNotification.create({
        data: {
          userId,
          movieId,
          notified: false,
        },
      })
      
      this.winstonLogger.info('Notification subscription created successfully', {
        service: 'MovieNotificationService',
        action: 'createNotificationForFutureMovie',
        notificationId: notification.id,
        userId,
        movieId,
      })
      
      return notification
    } catch (error) {
      this.winstonLogger.error('Failed to create notification subscription', {
        service: 'MovieNotificationService',
        action: 'createNotificationForFutureMovie',
        userId,
        movieId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  }

  @Cron('* * * * *') // Runs every minute
  async handleNotifications() {
    this.winstonLogger.info('Starting notification check for movies released today', {
      service: 'MovieNotificationService',
      action: 'handleNotifications',
      cronSchedule: 'every minute',
    })

    const now = new Date()
    const todayString = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0')
    
    const todayUTC = new Date(todayString + 'T00:00:00.000Z')

    this.winstonLogger.debug('Date comparison setup', {
      service: 'MovieNotificationService',
      action: 'handleNotifications',
      currentDate: todayString,
      currentDateUTC: todayUTC.toISOString(),
    })

    const moviesReleasedToday = await this.prisma.movie.findMany({
      where: {
        releaseDate: {
          gte: todayUTC,
          lt: new Date(todayUTC.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    this.winstonLogger.info('Movies released today found', {
      service: 'MovieNotificationService',
      action: 'handleNotifications',
      moviesCount: moviesReleasedToday.length,
      releaseDate: todayString,
    })

    if (moviesReleasedToday.length === 0) {
      this.winstonLogger.debug('No movies released today, finishing notification check', {
        service: 'MovieNotificationService',
        action: 'handleNotifications',
      })
      return
    }

    for (const movie of moviesReleasedToday) {
      this.winstonLogger.info('Processing movie notifications', {
        service: 'MovieNotificationService',
        action: 'handleNotifications',
        movieId: movie.id,
        movieTitle: movie.title,
        movieReleaseDate: movie.releaseDate.toISOString(),
      })
      
      const notifications = await this.prisma.userMovieNotification.findMany({
        where: {
          movieId: movie.id,
          notified: false,
        },
        include: {
          user: true,
        },
      })

      this.winstonLogger.info('Pending notifications found for movie', {
        service: 'MovieNotificationService',
        action: 'handleNotifications',
        movieId: movie.id,
        movieTitle: movie.title,
        pendingNotifications: notifications.length,
      })

      for (const notification of notifications) {
        try {
          this.winstonLogger.info('Sending notification email', {
            service: 'MovieNotificationService',
            action: 'sendNotificationEmail',
            notificationId: notification.id,
            userId: notification.userId,
            userEmail: notification.user.email,
            movieId: movie.id,
            movieTitle: movie.title,
          })
          
          await this.emailService.sendMovieAvailableEmail(
            notification.user.email,
            movie.title,
            `http://localhost:3001/movies/${movie.slug}`, // adicionar a url do front
          )
          
          await this.prisma.userMovieNotification.update({
            where: { id: notification.id },
            data: { notified: true },
          })
          
          this.winstonLogger.info('Notification email sent successfully', {
            service: 'MovieNotificationService',
            action: 'sendNotificationEmail',
            notificationId: notification.id,
            userId: notification.userId,
            userEmail: notification.user.email,
            movieId: movie.id,
            movieTitle: movie.title,
          })
        } catch (error) {
          this.winstonLogger.error('Failed to send notification email', {
            service: 'MovieNotificationService',
            action: 'sendNotificationEmail',
            notificationId: notification.id,
            userId: notification.userId,
            userEmail: notification.user.email,
            movieId: movie.id,
            movieTitle: movie.title,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          })
        }
      }
    }

    this.winstonLogger.info('Notification check completed', {
      service: 'MovieNotificationService',
      action: 'handleNotifications',
      processedMovies: moviesReleasedToday.length,
    })
  }

  async unsubscribeUserFromMovieNotification(userId: string, movieId: string) {
    await this.prisma.userMovieNotification.deleteMany({
      where: { userId, movieId },
    })
  }

  async isUserSubscribedToMovieNotification(userId: string, movieId: string) {
    const notification = await this.prisma.userMovieNotification.findUnique({
      where: { userId_movieId: { userId, movieId } },
    })
    return !!notification
  }

  async debugDates() {
    const now = new Date()
    const todayString = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0')
    
    const todayUTC = new Date(todayString + 'T00:00:00.000Z')

    const allMovies = await this.prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        releaseDate: true,
      },
      orderBy: {
        releaseDate: 'desc',
      },
    })

    return {
      currentDate: todayString,
      currentDateUTC: todayUTC.toISOString(),
      totalMovies: allMovies.length,
      movies: allMovies.map(movie => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.releaseDate.toISOString(),
        releaseDateFormatted: movie.releaseDate.toISOString().split('T')[0],
        isToday: movie.releaseDate >= todayUTC && movie.releaseDate < new Date(todayUTC.getTime() + 24 * 60 * 60 * 1000),
        isFuture: movie.releaseDate > todayUTC,
      })),
    }
  }

  async debugNotifications() {
    const notifications = await this.prisma.userMovieNotification.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
            releaseDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      totalNotifications: notifications.length,
      notifications: notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        userEmail: notification.user.email,
        movieId: notification.movieId,
        movieTitle: notification.movie.title,
        movieReleaseDate: notification.movie.releaseDate.toISOString().split('T')[0],
        notified: notification.notified,
        createdAt: notification.createdAt,
      })),
    }
  }
}
