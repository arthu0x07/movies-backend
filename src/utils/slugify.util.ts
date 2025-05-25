export function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // troca caracteres especiais por -
    .replace(/^-+|-+$/g, '') // remove - do início e fim
}
