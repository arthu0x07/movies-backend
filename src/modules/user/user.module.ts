import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
