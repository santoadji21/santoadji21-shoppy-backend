import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '@/features/users/dto/create-user.dto';
import { User } from '@prisma/client';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

export const excludePassword = (user: User): UserResponseDto => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;
  return result as UserResponseDto;
};
