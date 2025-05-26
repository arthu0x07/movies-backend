import { ValidationMessages } from '@/errors/validation-messages'
import { Language, MovieStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'

export class CreateMovieBodyDto {
  @IsString({ message: ValidationMessages.TITLE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TITLE_REQUIRED })
  title: string

  @IsString({ message: ValidationMessages.ORIGINAL_TITLE_STRING })
  @IsNotEmpty({ message: ValidationMessages.ORIGINAL_TITLE_REQUIRED })
  originalTitle: string

  @IsString({ message: ValidationMessages.DESCRIPTION_STRING })
  @IsNotEmpty({ message: ValidationMessages.DESCRIPTION_REQUIRED })
  description: string

  @IsString({ message: ValidationMessages.TAGLINE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TAGLINE_REQUIRED })
  tagline: string

  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_INVALID })
  @IsNotEmpty({ message: ValidationMessages.RELEASE_DATE_REQUIRED })
  releaseDate: string

  @Type(() => Number)
  @IsNumber({}, { message: ValidationMessages.DURATION_NUMBER })
  @Min(0, { message: ValidationMessages.DURATION_MIN })
  duration: number

  @IsEnum(MovieStatus, { message: ValidationMessages.STATUS_INVALID })
  @IsNotEmpty({ message: ValidationMessages.STATUS_REQUIRED })
  status: MovieStatus

  @IsString({ message: ValidationMessages.LANGUAGE_STRING })
  @IsNotEmpty({ message: ValidationMessages.LANGUAGE_REQUIRED })
  language: Language

  @IsNumber({}, { message: ValidationMessages.BUDGET_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.BUDGET_REQUIRED })
  budget: number

  @IsNumber({}, { message: ValidationMessages.REVENUE_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.REVENUE_REQUIRED })
  revenue: number

  @IsNumber({}, { message: ValidationMessages.POPULARITY_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.POPULARITY_REQUIRED })
  popularity: number

  @IsNumber({}, { message: ValidationMessages.VOTES_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.VOTES_REQUIRED })
  votes: number

  @IsNumber({}, { message: ValidationMessages.RATING_PERCENTAGE_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.RATING_PERCENTAGE_REQUIRED })
  ratingPercentage: number

  @IsArray({ message: ValidationMessages.GENRES_ARRAY })
  @IsUUID('all', {
    each: true,
    message: ValidationMessages.GENRE_UUID,
  })
  @IsNotEmpty({ message: ValidationMessages.GENRES_REQUIRED })
  genresIds: string[]

  @IsUUID(undefined, { message: ValidationMessages.FILE_UUID })
  @IsOptional()
  fileId: string
}
