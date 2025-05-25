import { Language, MovieStatus, PrismaClient } from '@prisma/client'

export async function seedMovies(prisma: PrismaClient) {
  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      name: 'Usuário de Teste',
      email: 'testuser@example.com',
      password: 'hashed-password-placeholder',
    },
  })

  const genreNames = ['Ação', 'Drama', 'Comédia']
  const genres: { id: string; name: string }[] = []

  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    genres.push(genre)
  }

  const movieData = [
    {
      title: 'Filme de Ação',
      slug: 'filme-de-acao',
      originalTitle: 'Action Movie',
      description: 'Um filme de ação muito bom',
      releaseDate: new Date('2023-01-01'),
      duration: 120,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 1000000,
      revenue: 5000000,
      popularity: 7.8,
      votes: 1000,
      ratingPercentage: 85,
      genresToConnect: [genres[0].id],
    },
    {
      title: 'Comédia Engraçada',
      slug: 'comedia-engracada',
      originalTitle: 'Funny Comedy',
      description: 'Um filme de comédia para rir',
      releaseDate: new Date('2022-06-15'),
      duration: 90,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 500000,
      revenue: 3000000,
      popularity: 6.5,
      votes: 600,
      ratingPercentage: 78,
      genresToConnect: [genres[2].id],
    },
  ]

  for (const movie of movieData) {
    const existing = await prisma.movie.findUnique({
      where: { slug: movie.slug },
    })
    if (!existing) {
      await prisma.movie.create({
        data: {
          title: movie.title,
          slug: movie.slug,
          originalTitle: movie.originalTitle,
          description: movie.description,
          releaseDate: movie.releaseDate,
          duration: movie.duration,
          status: movie.status,
          language: movie.language,
          userId: movie.userId,
          budget: movie.budget,
          revenue: movie.revenue,
          popularity: movie.popularity,
          votes: movie.votes,
          ratingPercentage: movie.ratingPercentage,
          genres: {
            connect: movie.genresToConnect.map((id) => ({ id })),
          },
        },
      })
    }
  }
}
