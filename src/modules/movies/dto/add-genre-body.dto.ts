import { IsArray, IsUUID } from 'class-validator'

export class AddGenreBodyDto {
  @IsArray()
  @IsUUID('all', { each: true })
  genreIds: string[]
}
