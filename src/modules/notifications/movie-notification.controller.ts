import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { MovieNotificationService } from './movie-notification.service'

@ApiTags('movie-notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/notifications/movies')
export class MovieNotificationController {
  constructor(
    private readonly movieNotificationService: MovieNotificationService,
  ) {}

  @Post('/:movieId')
  @ApiOperation({ summary: 'Inscrever usuário na notificação de um filme' })
  @ApiResponse({
    status: 201,
    description: 'Inscrição realizada com sucesso.',
    schema: {
      example: {
        message: 'Inscrição na notificação do filme realizada com sucesso.',
      },
    },
  })
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
  @ApiOperation({ summary: 'Cancelar inscrição na notificação de um filme' })
  @ApiResponse({
    status: 204,
    description: 'Inscrição cancelada com sucesso.',
  })
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

  @Get('/:movieId/status')
  @ApiOperation({ summary: 'Verificar se usuário está inscrito na notificação de um filme' })
  @ApiResponse({
    status: 200,
    description: 'Status da inscrição.',
    schema: {
      example: {
        isSubscribed: true,
      },
    },
  })
  async getNotificationStatus(
    @Param('movieId') movieId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const isSubscribed = await this.movieNotificationService.isUserSubscribedToMovieNotification(
      userId,
      movieId,
    )
    return { isSubscribed }
  }
}