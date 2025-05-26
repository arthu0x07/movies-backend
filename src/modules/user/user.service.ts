import { PrismaService } from '@/database/prisma/prisma.service'
import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { CreateAccountBodyDto } from './dto/create-account-body.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(body: CreateAccountBodyDto) {
    const { name, email, password } = body

    const userEmailExists = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userEmailExists) {
      throw new ConflictException('User email already exists in the database.')
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return {
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
        path: '/users',
      },
    }
  }
}
