import { ValidationMessages } from '@/errors/validation-messages'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class GetMoviesByUserDto {
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
