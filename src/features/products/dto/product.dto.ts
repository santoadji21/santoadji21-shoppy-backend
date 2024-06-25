import { z } from 'zod';

export const ProductSchema = z
  .object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    description: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    }),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .positive(),
  })
  .strict();

export type CreateProductDto = z.infer<typeof ProductSchema>;

export type UpdateProductDto = Partial<CreateProductDto>;
