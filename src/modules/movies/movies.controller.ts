import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AddGenreBodyDto } from './dto/add-genre-body.dto'
import { CreateMovieBodyDto } from './dto/create-movie.body.dto'
import { GetMoviesQueryDto } from './dto/get-movies-query.dto'
import { UpdateMovieBodyDto } from './dto/update-movie.body.dto'
import { MoviesService } from './movies.service'

@UseGuards(AuthGuard('jwt'))
@Controller('/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() body: CreateMovieBodyDto) {
    return this.moviesService.createMovie(body)
  }

  @Get()
  async listAllMovies(@Query() query: GetMoviesQueryDto) {
    return this.moviesService.listAllMovies(query)
  }

  @Get('/user/:userId')
  async listMoviesByUser(@Param('userId') userId: string) {
    return this.moviesService.listMoviesByUser(userId)
  }

  @Get('/:slug')
  async getMovieBySlug(@Param('slug') slug: string) {
    return this.moviesService.getMovieBySlug(slug)
  }

  @Patch('/:movieId')
  async updateMovie(
    @Param('movieId') movieId: string,
    @Body() body: UpdateMovieBodyDto,
  ) {
    return this.moviesService.updateMovie(movieId, body)
  }

  @Delete('/:movieId')
  async deleteMovie(@Param('movieId') movieId: string) {
    return this.moviesService.deleteMovie(movieId)
  }

  @Post('/:movieId/genres')
  async addGenresToMovie(
    @Param('movieId') movieId: string,
    @Body() body: AddGenreBodyDto,
  ) {
    return this.moviesService.addGenresToMovie(movieId, body.genreIds)
  }

  @Delete('/:movieId/genres/:genreId')
  async removeGenreFromMovie(
    @Param('movieId') movieId: string,
    @Param('genreId') genreId: string,
  ) {
    return this.moviesService.removeGenreFromMovie(movieId, genreId)
  }
}
