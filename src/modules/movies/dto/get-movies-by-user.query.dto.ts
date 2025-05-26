import { ValidationMessages } from '@/errors/validation-messages'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class GetMoviesByUserDto {
  @ApiPropertyOptional({ example: 1, description: 'Número da página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.PAGE_INTEGER })
  @Min(1, { message: ValidationMessages.PAGE_MIN })
  page?: number = 1

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantidade de itens por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.PER_PAGE_INTEGER })
  @Min(1, { message: ValidationMessages.PER_PAGE_MIN })
  perPage?: number = 10
}
