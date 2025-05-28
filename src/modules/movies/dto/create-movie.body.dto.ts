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
  @ApiProperty({
    example: 'Oppenheimer',
    description: 'Título do filme para exibição',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: ValidationMessages.TITLE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TITLE_REQUIRED })
  title: string

  @ApiProperty({
    example: 'Oppenheimer',
    description: 'Título original do filme em seu idioma de lançamento',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: ValidationMessages.ORIGINAL_TITLE_STRING })
  @IsNotEmpty({ message: ValidationMessages.ORIGINAL_TITLE_REQUIRED })
  originalTitle: string

  @ApiProperty({
    example: 'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.',
    description: 'Sinopse ou descrição detalhada do filme',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString({ message: ValidationMessages.DESCRIPTION_STRING })
  @IsNotEmpty({ message: ValidationMessages.DESCRIPTION_REQUIRED })
  description: string

  @ApiProperty({
    example: 'O mundo mudou para sempre',
    description: 'Frase de efeito ou slogan do filme',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: ValidationMessages.TAGLINE_STRING })
  @IsNotEmpty({ message: ValidationMessages.TAGLINE_REQUIRED })
  tagline: string

  @ApiProperty({
    example: '2023-07-21',
    description: 'Data de lançamento no formato ISO 8601 (YYYY-MM-DD)',
    format: 'date',
  })
  @IsDateString({}, { message: ValidationMessages.RELEASE_DATE_INVALID })
  @IsNotEmpty({ message: ValidationMessages.RELEASE_DATE_REQUIRED })
  releaseDate: string

  @ApiProperty({
    example: 180,
    description: 'Duração do filme em minutos',
    minimum: 1,
    maximum: 1000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: ValidationMessages.DURATION_NUMBER })
  @Min(0, { message: ValidationMessages.DURATION_MIN })
  duration: number

  @ApiProperty({
    example: MovieStatus.RELEASED,
    enum: MovieStatus,
    description: 'Status atual do filme (ANNOUNCED, IN_PRODUCTION, POST_PRODUCTION, RELEASED)',
    enumName: 'MovieStatus',
  })
  @IsEnum(MovieStatus, { message: ValidationMessages.STATUS_INVALID })
  @IsNotEmpty({ message: ValidationMessages.STATUS_REQUIRED })
  status: MovieStatus

  @ApiProperty({
    example: Language.EN,
    enum: Language,
    description: 'Idioma principal do filme (EN, PT, ES, FR, etc)',
    enumName: 'Language',
  })
  @IsString({ message: ValidationMessages.LANGUAGE_STRING })
  @IsNotEmpty({ message: ValidationMessages.LANGUAGE_REQUIRED })
  language: Language

  @ApiProperty({
    example: 100000000,
    description: 'Orçamento total do filme em dólares americanos (USD)',
    minimum: 0,
    format: 'float',
  })
  @IsNumber({}, { message: ValidationMessages.BUDGET_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.BUDGET_REQUIRED })
  budget: number

  @ApiProperty({
    example: 950000000,
    description: 'Receita total do filme em dólares americanos (USD)',
    minimum: 0,
    format: 'float',
  })
  @IsNumber({}, { message: ValidationMessages.REVENUE_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.REVENUE_REQUIRED })
  revenue: number

  @ApiProperty({
    example: 8.5,
    description: 'Índice de popularidade do filme (0-10)',
    minimum: 0,
    maximum: 10,
    format: 'float',
  })
  @IsNumber({}, { message: ValidationMessages.POPULARITY_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.POPULARITY_REQUIRED })
  popularity: number

  @ApiProperty({
    example: 50000,
    description: 'Número total de votos recebidos',
    minimum: 0,
    format: 'integer',
  })
  @IsNumber({}, { message: ValidationMessages.VOTES_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.VOTES_REQUIRED })
  votes: number

  @ApiProperty({
    example: 92,
    description: 'Porcentagem média das avaliações (0-100)',
    minimum: 0,
    maximum: 100,
    format: 'integer',
  })
  @IsNumber({}, { message: ValidationMessages.RATING_PERCENTAGE_NUMBER })
  @IsNotEmpty({ message: ValidationMessages.RATING_PERCENTAGE_REQUIRED })
  ratingPercentage: number

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    description: 'Lista de UUIDs dos gêneros associados ao filme',
    isArray: true,
    minItems: 1,
    uniqueItems: true,
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
    description: 'UUID do arquivo de poster do filme (opcional)',
    required: false,
    format: 'uuid',
  })
  @IsUUID(undefined, { message: ValidationMessages.FILE_UUID })
  @IsOptional()
  posterFileId?: string

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440011',
    description: 'UUID do arquivo de banner do filme (opcional)',
    required: false,
    format: 'uuid',
  })
  @IsUUID(undefined, { message: ValidationMessages.FILE_UUID })
  @IsOptional()
  bannerFileId?: string
}
