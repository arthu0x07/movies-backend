import { Body, Controller, Post } from '@nestjs/common'
import { AuthenticateService } from './authenticate.service'
import { AuthenticateBodyDto } from './dto/authenticate-body.dto'

@Controller('/auth')
export class AuthenticateController {
  constructor(private readonly authService: AuthenticateService) {}

  @Post()
  async handle(@Body() body: AuthenticateBodyDto) {
    const { email, password } = body
    return this.authService.authenticateUser(email, password)
  }
}
