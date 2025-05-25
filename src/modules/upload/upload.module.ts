import { Module } from '@nestjs/common'
import { FileUploadController } from './upload.controller'
import { PrismaModule } from '@/database/prisma/prisma.module'
import { FileUploadService } from './upload.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class UploadModule {}
