import { ValidationMessages } from '@/errors/validation-messages'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Language, MovieStatus } from '@prisma/client'
import { Transform, Type } from 'class-transformer'
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
  @ApiPropertyOptional({
    example: 'Inception',
    description: 'Filtrar por título',
  })
  @IsOptional()
  @IsString({ message: ValidationMessages.TITLE_STRING })
  title?: string

  @ApiPropertyOptional({ enum: MovieStatus, description: 'Filtrar por status' })
  @IsOptional()
  @IsEnum(MovieStatus, { message: ValidationMessages.STATUS_INVALID })
  status?: MovieStatus

  @ApiPropertyOptional({ enum: Language, description: 'Filtrar por idioma' })
  @IsOptional()
  @IsEnum(Language, { message: ValidationMessages.LANGUAGE_INVALID })
  language?: Language

  @ApiPropertyOptional({
    type: [String],
    description: 'IDs dos gêneros para filtro',
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Handle different formats: string, array, or undefined
    if (!value) return undefined
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return [value]
    // Handle object with numeric keys (from query params like genreIds[0], genreIds[1])
    if (typeof value === 'object') {
      return Object.values(value).filter(v => typeof v === 'string')
    }
    return undefined
  })
  @IsArray({ message: ValidationMessages.GENRE_IDS_ARRAY })
  @IsString({ each: true, message: ValidationMessages.GENRE_ID_STRING })
  genreIds?: string[]

  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Data mínima de lançamento (ISO 8601)',
  })
  @IsOptional()
  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_START_INVALID })
  releaseDateStart?: string

  @ApiPropertyOptional({
    example: '2023-12-31',
    description: 'Data máxima de lançamento (ISO 8601)',
  })
  @IsOptional()
  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_END_INVALID })
  releaseDateEnd?: string

  @ApiPropertyOptional({ example: 1, description: 'Número da página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.PAGE_INTEGER })
  @Min(1, { message: ValidationMessages.PAGE_MIN })
  page?: number = 1

  @ApiPropertyOptional({ example: 10, description: 'Itens por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.PER_PAGE_INTEGER })
  @Min(1, { message: ValidationMessages.PER_PAGE_MIN })
  perPage?: number = 10
}
