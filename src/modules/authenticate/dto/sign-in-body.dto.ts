import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class SignInBodyDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsString()
  password: string
}
