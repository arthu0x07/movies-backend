import { PrismaService } from '@/database/prisma/prisma.service'
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { SignInBodyDto } from './dto/sign-in-body.dto'

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    const accessToken = this.jwtService.sign({ sub: user.id })
    return { access_token: accessToken }
  }

  async signIn(body: SignInBodyDto) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const token = this.jwtService.sign({ sub: user.id })

    return {
      data: { token },
      meta: {
        timestamp: new Date().toISOString(),
        path: '/authenticate',
      },
    }
  }
}
