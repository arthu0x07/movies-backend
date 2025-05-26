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
  @IsString({ message: 'O título deve ser uma string.' })
  @IsNotEmpty({ message: 'O título não pode estar vazio.' })
  title: string

  @IsString({ message: 'O título original deve ser uma string.' })
  @IsNotEmpty({ message: 'O título original não pode estar vazio.' })
  originalTitle: string

  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  description: string

  @IsString({ message: 'O slogan (tagline) deve ser uma string.' })
  @IsNotEmpty({ message: 'O slogan não pode estar vazio.' })
  tagline: string

  @IsDateString(
    {},
    { message: 'A data de lançamento deve ser uma data válida.' },
  )
  @IsNotEmpty({ message: 'A data de lançamento não pode estar vazia.' })
  releaseDate: string

  @Type(() => Number)
  @IsNumber({}, { message: 'A duração deve ser um número.' })
  @Min(0, { message: 'A duração não pode ser negativa.' })
  duration: number

  @IsEnum(MovieStatus, {
    message:
      'Status inválido. Valores permitidos: "RELEASED", "UNRELEASED", etc.',
  })
  @IsNotEmpty({ message: 'O status não pode estar vazio.' })
  status: MovieStatus

  @IsString({ message: 'O idioma deve ser uma string.' })
  @IsNotEmpty({ message: 'O idioma não pode estar vazio.' })
  language: Language

  @IsNumber({}, { message: 'O orçamento deve ser um número.' })
  @IsNotEmpty({ message: 'O orçamento não pode estar vazio.' })
  budget: number

  @IsNumber({}, { message: 'A receita deve ser um número.' })
  @IsNotEmpty({ message: 'A receita não pode estar vazia.' })
  revenue: number

  @IsNumber({}, { message: 'A popularidade deve ser um número.' })
  @IsNotEmpty({ message: 'A popularidade não pode estar vazia.' })
  popularity: number

  @IsNumber({}, { message: 'O número de votos deve ser um número.' })
  @IsNotEmpty({ message: 'O número de votos não pode estar vazio.' })
  votes: number

  @IsNumber({}, { message: 'A porcentagem de avaliação deve ser um número.' })
  @IsNotEmpty({ message: 'A porcentagem de avaliação não pode estar vazia.' })
  ratingPercentage: number

  @IsArray({ message: 'Os gêneros devem ser um array.' })
  @IsUUID('all', {
    each: true,
    message: 'Cada gênero deve ser um UUID válido.',
  })
  @IsNotEmpty({ message: 'Os gêneros não podem estar vazios.' })
  genresIds: string[]

  @IsUUID(undefined, { message: 'O ID do arquivo deve ser um UUID válido.' })
  @IsOptional()
  fileId: string
}
