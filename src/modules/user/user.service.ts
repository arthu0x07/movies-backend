import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from '@/database/prisma/prisma.service'
import { CreateAccountBodyDto } from './dto/create-account-body.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(body: CreateAccountBodyDto): Promise<void> {
    const { name, email, password } = body

    const userEmailExists = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userEmailExists) {
      throw new ConflictException('User email already exists in the database.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
