import { ValidationMessages } from '@/errors/validation-messages'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateAccountBodyDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    required: true,
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: ValidationMessages.NAME_REQUIRED })
  @MinLength(3)
  name: string

  @ApiProperty({
    description: 'E-mail para login e comunicações',
    example: 'joao.silva@exemplo.com',
    required: true,
    format: 'email',
    uniqueItems: true,
  })
  @IsEmail({}, { message: ValidationMessages.INVALID_EMAIL })
  email: string

  @ApiProperty({
    description: 'Senha para autenticação (mínimo 6 caracteres)',
    example: 'Senha@123',
    required: true,
    minLength: 6,
    format: 'password',
  })
  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  @MinLength(6)
  password: string
}
