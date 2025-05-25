import { Controller, Post, Body } from '@nestjs/common'
import { EmailService } from './email.service'
import { SendMovieEmailDto } from './dto/send-email.dto'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-movie-available')
  async sendMovieEmail(@Body() body: SendMovieEmailDto) {
    return this.emailService.sendMovieAvailableEmail(
      body.to,
      body.movieName,
      body.watchUrl,
    )
  }
}
