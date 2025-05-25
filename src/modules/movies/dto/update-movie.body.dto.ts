import { PartialType } from '@nestjs/swagger'
import { CreateMovieBodyDto } from './create-movie.body.dto'

export class UpdateMovieBodyDto extends PartialType(CreateMovieBodyDto) {}
