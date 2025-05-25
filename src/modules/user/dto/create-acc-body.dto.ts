import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateAccountBodyDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsEmail({}, { message: 'O e-mail informado não é válido' })
  @IsNotEmpty({
    message: 'O e-mail é obrigatório',
  })
  email: string

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}
