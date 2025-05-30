import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class AddGenreBodyDto {
  @ApiProperty({
    description: 'Lista de IDs dos gêneros a adicionar',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  genreIds: string[]
}
