import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ValidationMessages } from '@/errors/validation-messages'

export class CreateAccountBodyDto {
  @IsNotEmpty({ message: ValidationMessages.NAME_REQUIRED })
  name: string

  @IsEmail({}, { message: ValidationMessages.INVALID_EMAIL })
  email: string

  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  password: string
}
