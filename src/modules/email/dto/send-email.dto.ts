import { IsEmail, IsString, IsUrl } from 'class-validator'

export class SendMovieEmailDto {
  @IsEmail()
  to: string

  @IsString()
  movieName: string

  @IsUrl()
  watchUrl: string
}
