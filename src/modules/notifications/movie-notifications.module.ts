import { Module } from '@nestjs/common'
import { MovieNotificationService } from './movie-notification.service'
import { MovieNotificationController } from './movie-notification.controller'
import { PrismaService } from '@/database/prisma/prisma.service'
import { EmailService } from '../email/email.service'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MovieNotificationController],
  providers: [MovieNotificationService, PrismaService, EmailService],
  exports: [MovieNotificationService],
})
export class MovieNotificationModule {}
