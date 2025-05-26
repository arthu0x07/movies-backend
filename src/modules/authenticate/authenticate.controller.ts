import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthenticateService } from './authenticate.service'
import { AuthenticateBodyDto } from './dto/authenticate-body.dto'

@ApiTags('Authenticate')
@Controller('/auth')
export class AuthenticateController {
  constructor(private readonly authService: AuthenticateService) {}

  @Post()
  @ApiOperation({ summary: 'Autenticar usuário e gerar token' })
  @ApiBody({ type: AuthenticateBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário autenticado com sucesso, token retornado.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos (e-mail ou senha faltando/errados).',
  })
  @ApiResponse({
    status: 401,
    description: 'Falha na autenticação (credenciais inválidas).',
  })
  async handle(@Body() body: AuthenticateBodyDto) {
    const { email, password } = body
    return this.authService.authenticateUser(email, password)
  }
}
