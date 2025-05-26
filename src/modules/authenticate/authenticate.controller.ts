import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthenticateService } from './authenticate.service'
import { SignInBodyDto } from './dto/sign-in-body.dto'

@ApiTags('Autenticação')
@Controller('/authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login na aplicação' })
  @ApiBody({ type: SignInBodyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
  })
  async signIn(@Body() body: SignInBodyDto) {
    return this.authenticateService.signIn(body)
  }
}
