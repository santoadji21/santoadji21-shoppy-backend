import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  userId: z.number().int(),
});

export type CreateProductDto = z.infer<typeof ProductSchema>;

export type UpdateProductDto = Partial<CreateProductDto>;
