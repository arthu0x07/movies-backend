import { Module } from '@nestjs/common'
import { AuthenticateController } from './authenticate.controller'
import { AuthenticateService } from './authenticate.service'
import { PrismaService } from '@/database/prisma/prisma.service'

@Module({
  controllers: [AuthenticateController],
  providers: [PrismaService, AuthenticateService],
})
export class AuthenticateModule {}
