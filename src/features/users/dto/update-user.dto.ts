import { CreateUserDtoSchema } from '@/features/users/dto/create-user.dto';
import { z } from 'zod';

export const UpdateUserDtoSchema = CreateUserDtoSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
