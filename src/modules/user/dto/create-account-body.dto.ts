import { ValidationMessages } from '@/errors/validation-messages'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateAccountBodyDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Usuario Example',
    required: true,
  })
  @IsNotEmpty({ message: ValidationMessages.NAME_REQUIRED })
  name: string

  @ApiProperty({
    description: 'E-mail válido do usuário para login',
    example: 'usuario@example.com',
    required: true,
  })
  @IsEmail({}, { message: ValidationMessages.INVALID_EMAIL })
  email: string

  @ApiProperty({
    description: 'Senha para autenticação (mínimo 8 caracteres recomendados)',
    example: 'SenhaSegura123!',
    required: true,
  })
  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  password: string
}
