import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator'
import { Language, MovieStatus } from '@prisma/client'

export class CreateMovieBodyDto {
  @IsString()
  title: string

  @IsString()
  originalTitle: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  tagline?: string

  @IsDateString()
  releaseDate: Date

  @IsNumber()
  duration: number

  @IsEnum(MovieStatus)
  status: MovieStatus

  @IsEnum(Language)
  language: Language

  @IsOptional()
  @IsNumber()
  budget?: number

  @IsOptional()
  @IsNumber()
  revenue?: number

  @IsOptional()
  @IsNumber()
  popularity?: number

  @IsOptional()
  @IsNumber()
  votes?: number

  @IsOptional()
  @IsNumber()
  ratingPercentage?: number

  @IsUUID()
  userId: string

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  genresIds?: string[]
}
