import { Module } from '@nestjs/common'
import { FileUploadController } from './upload.controller'
import { FileUploadService } from './upload.service'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@/database/prisma/prisma.module'

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class UploadModule {}
