import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class GetMoviesByUserDto {
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
