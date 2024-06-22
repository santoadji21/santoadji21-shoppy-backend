import { z } from 'zod';

export const TokenPayloadSchema = z.object({
  email: z.string().email(),
  userId: z.string().or(z.number()),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
