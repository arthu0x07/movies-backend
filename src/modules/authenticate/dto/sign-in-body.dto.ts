import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class SignInBodyDto {
  @ApiProperty({
    description: 'E-mail cadastrado do usuário',
    example: 'usuario@exemplo.com',
    format: 'email',
    uniqueItems: true,
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'Senha@123',
    minLength: 6,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  password: string
}
