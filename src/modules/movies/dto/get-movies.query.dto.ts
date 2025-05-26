import { ValidationMessages } from '@/errors/validation-messages'
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
  @IsString({ message: ValidationMessages.TITLE_STRING })
  title?: string

  @IsOptional()
  @IsEnum(MovieStatus, { message: ValidationMessages.STATUS_INVALID })
  status?: MovieStatus

  @IsOptional()
  @IsEnum(Language, { message: ValidationMessages.LANGUAGE_INVALID })
  language?: Language

  @IsOptional()
  @IsArray({ message: ValidationMessages.GENRE_IDS_ARRAY })
  @IsString({ each: true, message: ValidationMessages.GENRE_ID_STRING })
  genreIds?: string[]

  @IsOptional()
  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_START_INVALID })
  releaseDateStart?: string

  @IsOptional()
  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_END_INVALID })
  releaseDateEnd?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.PAGE_INTEGER })
  @Min(1, { message: ValidationMessages.PAGE_MIN })
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.PER_PAGE_INTEGER })
  @Min(1, { message: ValidationMessages.PER_PAGE_MIN })
  perPage?: number = 10
}
