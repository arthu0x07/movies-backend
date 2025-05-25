import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { movieAvailableTemplate } from './templates/movie-available.template'

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY)

  async sendEmail(to: string, subject: string, html: string) {
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    })
  }

  async sendMovieAvailableEmail(
    to: string,
    movieName: string,
    watchUrl: string,
  ) {
    const subject = `🎬 Filme Disponível: ${movieName}`
    const html = movieAvailableTemplate(movieName, watchUrl)

    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    })
  }
}
