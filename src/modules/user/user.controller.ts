import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes'
import { createAccBodySchema, CreateAccBodySchema } from './create-acc.schema'
import { UserService } from './user.service'

const createAccValidationPipe = new ZodValidationPipe(createAccBodySchema)

@Controller('/accounts')
export class UserController {
  constructor(private readonly createAccService: UserService) {}

  @Post()
  async handle(@Body(createAccValidationPipe) body: CreateAccBodySchema) {
    try {
      await this.createAccService.createAccount(body)
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new ConflictException('Error creating account.')
    }
  }
}
