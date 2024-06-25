import { excludePassword, hashPassword } from '@/common/utils/auth.utils';
import {
  CreateUserDto,
  UserResponseDto,
} from '@/features/users/dto/create-user.dto';
import { UpdateUserDto } from '@/features/users/dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return excludePassword(user);
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUniqueOrThrow({ where: { id } });
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.findUnique({ where: filter });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
