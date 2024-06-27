import { z } from 'zod';

export const SessionSchema = z
  .object({
    productId: z.number({
      required_error: 'ProductId is required',
      invalid_type_error: 'ProductId must be a number',
      message: 'ProductId must be a number',
    }),
  })
  .strict();

export type CreateSessionRequestDto = z.infer<typeof SessionSchema>;
