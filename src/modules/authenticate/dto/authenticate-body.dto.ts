import { ValidationMessages } from '@/errors/validation-messages'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateBodyDto {
  @ApiProperty({
    description: 'E-mail do usuário para autenticação',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: ValidationMessages.INVALID_EMAIL })
  @IsNotEmpty({ message: ValidationMessages.EMAIL_REQUIRED })
  email: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaSegura123!',
  })
  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  password: string
}
