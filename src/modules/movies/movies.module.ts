import { PrismaModule } from '@/database/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { EmailService } from '../email/email.service'
import { MovieNotificationService } from '../notifications/movie-notification.service'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MoviesService, MovieNotificationService, EmailService],
})
export class MoviesModule {}
