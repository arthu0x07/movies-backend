import { Module } from '@nestjs/common'
import { HelloController } from './hello.controller'
import { PrismaModule } from '@/prisma/prisma-module'

@Module({
  imports: [PrismaModule],
  controllers: [HelloController],
})
export class HelloModule {}
