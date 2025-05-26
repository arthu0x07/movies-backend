import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import {
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateAccountBodyDto } from './dto/create-account-body.dto'
import { UserService } from './user.service'

@ApiTags('Usuários')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova conta de usuário' })
  @ApiBody({ type: CreateAccountBodyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conta criada com sucesso',
  })
  @ApiConflictResponse({
    description: 'Já existe uma conta com esse e-mail',
  })
  async createAccount(@Body() body: CreateAccountBodyDto): Promise<void> {
    try {
      await this.userService.createAccount(body)
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new ConflictException('Erro ao criar conta.')
    }
  }
}
