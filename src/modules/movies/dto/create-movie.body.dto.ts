import { ValidationMessages } from '@/errors/validation-messages'
import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty({ example: 'Inception', description: 'Título do filme' })
  @IsString({ message: ValidationMessages.TITLE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TITLE_REQUIRED })
  title: string

  @ApiProperty({
    example: 'Inception Original',
    description: 'Título original do filme',
  })
  @IsString({ message: ValidationMessages.ORIGINAL_TITLE_STRING })
  @IsNotEmpty({ message: ValidationMessages.ORIGINAL_TITLE_REQUIRED })
  originalTitle: string

  @ApiProperty({
    example: 'Um thriller de ficção científica...',
    description: 'Descrição detalhada do filme',
  })
  @IsString({ message: ValidationMessages.DESCRIPTION_STRING })
  @IsNotEmpty({ message: ValidationMessages.DESCRIPTION_REQUIRED })
  description: string

  @ApiProperty({
    example: 'A mente é o verdadeiro enigma',
    description: 'Tagline do filme',
  })
  @IsString({ message: ValidationMessages.TAGLINE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TAGLINE_REQUIRED })
  tagline: string

  @ApiProperty({
    example: '2010-07-16',
    description: 'Data de lançamento (ISO 8601)',
  })
  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_INVALID })
  @IsNotEmpty({ message: ValidationMessages.RELEASE_DATE_REQUIRED })
  releaseDate: string

  @ApiProperty({ example: 148, description: 'Duração do filme em minutos' })
  @Type(() => Number)
  @IsNumber({}, { message: ValidationMessages.DURATION_NUMBER })
  @Min(0, { message: ValidationMessages.DURATION_MIN })
  duration: number

  @ApiProperty({
    example: MovieStatus.RELEASED,
    enum: MovieStatus,
    description: 'Status do filme',
  })
  @IsEnum(MovieStatus, { message: ValidationMessages.STATUS_INVALID })
  @IsNotEmpty({ message: ValidationMessages.STATUS_REQUIRED })
  status: MovieStatus

  @ApiProperty({
    example: Language.EN,
    enum: Language,
    description: 'Idioma do filme',
  })
  @IsString({ message: ValidationMessages.LANGUAGE_STRING })
  @IsNotEmpty({ message: ValidationMessages.LANGUAGE_REQUIRED })
  language: Language

  @ApiProperty({
    example: 160000000,
    description: 'Orçamento do filme em dólares',
  })
  @IsNumber({}, { message: ValidationMessages.BUDGET_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.BUDGET_REQUIRED })
  budget: number

  @ApiProperty({
    example: 829895144,
    description: 'Receita do filme em dólares',
  })
  @IsNumber({}, { message: ValidationMessages.REVENUE_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.REVENUE_REQUIRED })
  revenue: number

  @ApiProperty({ example: 9.5, description: 'Popularidade do filme' })
  @IsNumber({}, { message: ValidationMessages.POPULARITY_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.POPULARITY_REQUIRED })
  popularity: number

  @ApiProperty({ example: 12000, description: 'Número de votos' })
  @IsNumber({}, { message: ValidationMessages.VOTES_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.VOTES_REQUIRED })
  votes: number

  @ApiProperty({ example: 95, description: 'Porcentagem de avaliação' })
  @IsNumber({}, { message: ValidationMessages.RATING_PERCENTAGE_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.RATING_PERCENTAGE_REQUIRED })
  ratingPercentage: number

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'IDs dos gêneros do filme',
    isArray: true,
  })
  @IsArray({ message: ValidationMessages.GENRES_ARRAY })
  @IsUUID('all', {
    each: true,
    message: ValidationMessages.GENRE_UUID,
  })
  @IsNotEmpty({ message: ValidationMessages.GENRES_REQUIRED })
  genresIds: string[]

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440010',
    description: 'ID do arquivo opcional',
    required: false,
  })
  @IsUUID(undefined, { message: ValidationMessages.FILE_UUID })
  @IsOptional()
  fileId?: string
}
