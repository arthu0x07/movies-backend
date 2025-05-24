import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, Post } from '@nestjs/common'

@Controller('/hello')
export class HelloController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getHello() {
    return 'Hello, World!!'
  }

  @Post()
  async createHello() {
    const data = await this.prisma.exampleModel.create({
      data: {
        name: 'Hello',
      },
    })
    return { data }
  }
}
