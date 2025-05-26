export const ValidationMessages = {
  // Common
  INVALID_EMAIL: 'O e-mail informado não é válido',
  EMAIL_REQUIRED: 'O e-mail é obrigatório',
  NAME_REQUIRED: 'O nome é obrigatório',
  PASSWORD_REQUIRED: 'A senha é obrigatória',
  PASSWORD_STRING: 'A senha precisa ser uma string',

  // File
  FILE_REQUIRED: 'O arquivo é obrigatório',
  INVALID_FILE_TYPE:
    'Tipo de arquivo inválido. Envie uma imagem (jpg, jpeg, png ou webp)',
  FILE_TOO_LARGE: 'O arquivo excede o tamanho máximo permitido de 5MB',
  FILE_UUID: 'O ID do arquivo deve ser um UUID válido.',

  // Movie - Strings
  TITLE_STRING: 'O título deve ser uma string.',
  TITLE_REQUIRED: 'O título não pode estar vazio.',
  ORIGINAL_TITLE_STRING: 'O título original deve ser uma string.',
  ORIGINAL_TITLE_REQUIRED: 'O título original não pode estar vazio.',
  DESCRIPTION_STRING: 'A descrição deve ser uma string.',
  DESCRIPTION_REQUIRED: 'A descrição não pode estar vazia.',
  TAGLINE_STRING: 'O slogan (tagline) deve ser uma string.',
  TAGLINE_REQUIRED: 'O slogan não pode estar vazio.',

  // Movie - Release Date
  RELEASE_DATE_INVALID: 'A data de lançamento deve ser uma data válida.',
  RELEASE_DATE_REQUIRED: 'A data de lançamento não pode estar vazia.',

  // Movie - Duration
  DURATION_NUMBER: 'A duração deve ser um número.',
  DURATION_MIN: 'A duração não pode ser negativa.',

  // Movie - Status & Language
  STATUS_INVALID:
    'Status inválido. Valores permitidos: "RELEASED", "IN_PRODUCTION", "PLANNED", "CANCELLED".',
  STATUS_REQUIRED: 'O status não pode estar vazio.',
  LANGUAGE_STRING: 'O idioma deve ser uma string.',
  LANGUAGE_REQUIRED: 'O idioma não pode estar vazio.',
  LANGUAGE_INVALID: 'Idioma inválido. Valores permitidos: "pt-BR", "en-US".',

  // Movie - Financials
  BUDGET_NUMBER: 'O orçamento deve ser um número.',
  BUDGET_REQUIRED: 'O orçamento não pode estar vazio.',
  REVENUE_NUMBER: 'A receita deve ser um número.',
  REVENUE_REQUIRED: 'A receita não pode estar vazia.',

  // Movie - Popularity & Votes
  POPULARITY_NUMBER: 'A popularidade deve ser um número.',
  POPULARITY_REQUIRED: 'A popularidade não pode estar vazia.',
  VOTES_NUMBER: 'O número de votos deve ser um número.',
  VOTES_REQUIRED: 'O número de votos não pode estar vazio.',
  RATING_PERCENTAGE_NUMBER: 'A porcentagem de avaliação deve ser um número.',
  RATING_PERCENTAGE_REQUIRED:
    'A porcentagem de avaliação não pode estar vazia.',

  // Movie - Genres
  GENRES_ARRAY: 'Os gêneros devem ser um array.',
  GENRE_UUID: 'Cada gênero deve ser um UUID válido.',
  GENRES_REQUIRED: 'Os gêneros não podem estar vazios.',

  // Movies - Query Filters
  GENRE_IDS_ARRAY: 'genreIds deve ser um array de strings',
  GENRE_ID_STRING: 'Cada genreId deve ser uma string',
  RELEASE_DATE_START_INVALID:
    'A data releaseDateStart deve ser uma string válida no formato ISO 8601',
  RELEASE_DATE_END_INVALID:
    'A data releaseDateEnd deve ser uma string válida no formato ISO 8601',

  // Pagination
  PAGE_INTEGER: 'page deve ser um número inteiro',
  PAGE_MIN: 'page deve ser no mínimo 1',
  PER_PAGE_INTEGER: 'perPage deve ser um número inteiro',
  PER_PAGE_MIN: 'perPage deve ser no mínimo 1',
}
