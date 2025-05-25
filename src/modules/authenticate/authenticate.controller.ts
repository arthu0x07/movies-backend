import { Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes'
import { z } from 'zod'
import { AuthenticateService } from './authenticate.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

const authenticateBodyValidationPipe = new ZodValidationPipe(
  authenticateBodySchema,
)

@Controller('/sessions')
export class AuthenticateController {
  constructor(private readonly authService: AuthenticateService) {}

  @Post()
  async handle(
    @Body(authenticateBodyValidationPipe) body: AuthenticateBodySchema,
  ) {
    const { email, password } = body
    return this.authService.authenticateUser(email, password)
  }
}
