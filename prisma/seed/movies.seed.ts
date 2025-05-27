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

  const genreNames = [
    'Ação',
    'Drama',
    'Comédia',
    'Ficção Científica',
    'Aventura',
    'Crime',
    'Suspense',
    'Animação',
  ]
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
      title: 'Interestelar',
      slug: 'interestelar',
      originalTitle: 'Interstellar',
      description:
        'Em um futuro onde a Terra está se tornando inabitável, um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.',
      releaseDate: new Date('2014-11-07'),
      duration: 169,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 165000000,
      revenue: 701729206,
      popularity: 8.9,
      votes: 1500000,
      ratingPercentage: 88,
      genresToConnect: [
        genres.find((g) => g.name === 'Ficção Científica')!.id,
        genres.find((g) => g.name === 'Drama')!.id,
      ],
      tagline: 'A humanidade nasceu na Terra. Não morrerá aqui.',
    },
    {
      title: 'A Origem',
      slug: 'a-origem',
      originalTitle: 'Inception',
      description:
        'Um ladrão especializado em extrair segredos do subconsciente durante o estado de sono é oferecido uma chance de ter sua vida antiga de volta como pagamento para uma tarefa considerada impossível: "inserção".',
      releaseDate: new Date('2010-07-16'),
      duration: 148,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 160000000,
      revenue: 836836967,
      popularity: 8.8,
      votes: 2000000,
      ratingPercentage: 91,
      genresToConnect: [
        genres.find((g) => g.name === 'Ficção Científica')!.id,
        genres.find((g) => g.name === 'Ação')!.id,
      ],
      tagline: 'O sonho é real',
    },
    {
      title: 'Pulp Fiction: Tempo de Violência',
      slug: 'pulp-fiction',
      originalTitle: 'Pulp Fiction',
      description:
        'Vários eventos se entrelaçam em uma história não linear que envolve dois assassinos profissionais, um boxeador, um gângster e sua esposa, e um par de bandidos de restaurante.',
      releaseDate: new Date('1994-10-14'),
      duration: 154,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 8000000,
      revenue: 213928762,
      popularity: 8.7,
      votes: 1800000,
      ratingPercentage: 94,
      genresToConnect: [
        genres.find((g) => g.name === 'Crime')!.id,
        genres.find((g) => g.name === 'Drama')!.id,
      ],
      tagline: 'Você nunca viu nada igual',
    },
    {
      title: 'Toy Story',
      slug: 'toy-story',
      originalTitle: 'Toy Story',
      description:
        'Um cowboy de brinquedo se sente ameaçado e ciumento quando um novo brinquedo espacial se torna o favorito do menino que o possui.',
      releaseDate: new Date('1995-11-22'),
      duration: 81,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 30000000,
      revenue: 373554033,
      popularity: 8.3,
      votes: 1400000,
      ratingPercentage: 92,
      genresToConnect: [
        genres.find((g) => g.name === 'Animação')!.id,
        genres.find((g) => g.name === 'Aventura')!.id,
      ],
      tagline: 'O primeiro longa totalmente animado por computador do mundo',
    },
    {
      title: 'Cidade de Deus',
      slug: 'cidade-de-deus',
      originalTitle: 'Cidade de Deus',
      description:
        'Buscapé é um jovem pobre, negro e sensível, que cresce em um universo de muita violência. Ele vive na Cidade de Deus, favela carioca conhecida por ser um dos locais mais violentos do Rio.',
      releaseDate: new Date('2002-08-30'),
      duration: 130,
      status: MovieStatus.RELEASED,
      language: Language.PT,
      userId: user.id,
      budget: 3300000,
      revenue: 30600000,
      popularity: 8.6,
      votes: 700000,
      ratingPercentage: 91,
      genresToConnect: [
        genres.find((g) => g.name === 'Crime')!.id,
        genres.find((g) => g.name === 'Drama')!.id,
      ],
      tagline: 'Se correr o bicho pega, se ficar o bicho come',
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
          tagline: movie.tagline,
          genres: {
            connect: movie.genresToConnect.map((id) => ({ id })),
          },
        },
      })
    }
  }
}
