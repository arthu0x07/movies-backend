import {
  Controller,
  UseGuards,
  Post,
  Delete,
  Param,
  HttpCode,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { MovieNotificationService } from './movie-notification.service'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'

@UseGuards(AuthGuard('jwt'))
@Controller('/notifications/movies')
export class MovieNotificationController {
  constructor(
    private readonly movieNotificationService: MovieNotificationService,
  ) {}

  @Post('/:movieId')
  async subscribeToMovieNotification(
    @Param('movieId') movieId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    await this.movieNotificationService.subscribeUserToMovieNotification(
      userId,
      movieId,
    )
    return {
      message: 'Inscrição na notificação do filme realizada com sucesso.',
    }
  }

  @Delete('/:movieId')
  @HttpCode(204)
  async unsubscribeFromMovieNotification(
    @Param('movieId') movieId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    await this.movieNotificationService.unsubscribeUserFromMovieNotification(
      userId,
      movieId,
    )
  }
}
