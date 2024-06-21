import { z } from 'zod';

export const CreateUserDtoSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .strict();

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type UserResponseDto = Omit<CreateUserDto, 'password'>;
