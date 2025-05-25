import { z } from 'zod'

export const createAccBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type CreateAccBodySchema = z.infer<typeof createAccBodySchema>
