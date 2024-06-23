import { z } from 'zod';

export const TokenPayloadSchema = z.object({
  email: z.string().email(),
  userId: z.number().int(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
