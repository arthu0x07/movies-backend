import { PrismaModule } from '@/database/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FileUploadController } from './upload.controller'
import { FileUploadService } from './upload.service'

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class UploadModule {}
