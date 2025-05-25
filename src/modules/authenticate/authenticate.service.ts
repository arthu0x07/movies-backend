import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new NotFoundException('User credentials not valid')
    }

    const accessToken = this.jwt.sign({ sub: user.id })
    return { access_token: accessToken }
  }
}
