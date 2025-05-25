import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { CreateAccBodySchema } from './create-acc.schema'
import { PrismaService } from '@/database/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(body: CreateAccBodySchema): Promise<void> {
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
