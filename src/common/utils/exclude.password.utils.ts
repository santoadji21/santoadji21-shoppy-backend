import { UserResponseDto } from '@/features/users/dto/create-user.dto';
import { User } from '@prisma/client';

export const excludePassword = (user: User): UserResponseDto => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;
  return result as UserResponseDto;
};
