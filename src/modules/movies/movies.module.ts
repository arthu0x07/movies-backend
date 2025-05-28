import { PrismaModule } from '@/database/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'
import { MovieNotificationService } from '../notifications/movie-notification.service'
import { EmailService } from '../email/email.service'

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MoviesService, MovieNotificationService, EmailService],
})
export class MoviesModule {}
