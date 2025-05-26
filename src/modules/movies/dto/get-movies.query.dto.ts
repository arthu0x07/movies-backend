import { Language, MovieStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

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

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page deve ser um número inteiro' })
  @Min(1, { message: 'page deve ser no mínimo 1' })
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'perPage deve ser um número inteiro' })
  @Min(1, { message: 'perPage deve ser no mínimo 1' })
  perPage?: number = 10
}
