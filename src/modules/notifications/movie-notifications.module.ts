import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { EmailService } from '../email/email.service'
import { MovieNotificationController } from './movie-notification.controller'
import { MovieNotificationService } from './movie-notification.service'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MovieNotificationController],
  providers: [MovieNotificationService, PrismaService, EmailService],
  exports: [MovieNotificationService],
})
export class MovieNotificationModule {}
