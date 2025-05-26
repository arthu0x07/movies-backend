import { ValidationMessages } from '@/errors/validation-messages'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateBodyDto {
  @IsEmail({}, { message: ValidationMessages.INVALID_EMAIL })
  @IsNotEmpty({ message: ValidationMessages.EMAIL_REQUIRED })
  email: string

  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @IsNotEmpty({ message: ValidationMessages.PASSWORD_REQUIRED })
  password: string
}
