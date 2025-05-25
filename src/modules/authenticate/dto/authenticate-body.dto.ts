import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateBodyDto {
  @IsEmail({}, { message: 'O e-mail informado não é válido' })
  @IsNotEmpty({
    message: 'O e-mail é obrigatório',
  })
  email: string

  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string
}
