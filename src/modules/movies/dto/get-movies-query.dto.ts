import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsArray,
  IsUUID,
} from 'class-validator'
import { MovieStatus, Language } from '@prisma/client'

export class GetMoviesQueryDto {
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  title?: string

  @IsOptional()
  @IsEnum(MovieStatus, {
    message:
      'O status deve ser um dos valores: RELEASED, IN_PRODUCTION, PLANNED, CANCELLED',
  })
  status?: MovieStatus

  @IsOptional()
  @IsEnum(Language, {
    message: 'A linguagem deve ser uma das seguintes: EN, PT, ES, FR, DE, JP',
  })
  language?: Language

  @IsOptional()
  @IsArray({ message: 'genreIds deve ser um array de strings' })
  @IsString({ each: true, message: 'Cada genreId deve ser uma string' })
  genreIds?: string[]

  @IsOptional()
  @IsUUID('4', { message: 'O userId deve ser um UUID válido' })
  userId?: string

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'A data releaseDateStart deve ser uma string válida no formato ISO 8601',
    },
  )
  releaseDateStart?: string

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'A data releaseDateEnd deve ser uma string válida no formato ISO 8601',
    },
  )
  releaseDateEnd?: string
}
