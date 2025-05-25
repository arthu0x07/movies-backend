import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { CreateAccountBodyDto } from './dto/create-acc-body.dto'
import { UserService } from './user.service'

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async CreateAccount(@Body() body: CreateAccountBodyDto) {
    try {
      await this.userService.createAccount(body)
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new ConflictException('Error creating account.')
    }
  }
}
