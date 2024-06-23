import { ZodValidation } from '@/common/decorators/zod-decorators';
import { CurrentUser } from '@/features/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { TokenPayload } from '@/features/auth/schema/token.schema';
import {
  CreateUserDto,
  CreateUserDtoSchema,
} from '@/features/users/dto/create-user.dto';
import {
  UpdateUserDto,
  UpdateUserDtoSchema,
} from '@/features/users/dto/update-user.dto';
import { UsersService } from '@/features/users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('users')
export class UsersController {
  constructor(
    @InjectPinoLogger() private readonly logger: PinoLogger,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @ZodValidation(CreateUserDtoSchema)
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.info('Creating a new user');
    this.logger.info(JSON.stringify(createUserDto));
    try {
      const user = await this.usersService.create(createUserDto);
      this.logger.info('User created successfully');
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }

  @Get()
  async findAll() {
    this.logger.info('Fetching all users');
    try {
      const users = await this.usersService.findAll();
      this.logger.info('Users fetched successfully');
      return users;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw new BadRequestException('Failed to fetch users');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.info(`Fetching user with ID ${id}`);
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.info(`User with ID ${id} fetched successfully`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`User with ID ${id} not found`);
        throw error;
      }
      this.logger.error(`Error fetching user with ID ${id}`, error);
      throw new BadRequestException(`Failed to fetch user with ID ${id}`);
    }
  }

  @Patch(':id')
  @ZodValidation(UpdateUserDtoSchema)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.info(`Updating user with ID ${id}`);
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      this.logger.info(`User with ID ${id} updated successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}`, error);
      throw new BadRequestException(`Failed to update user with ID ${id}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.info(`Removing user with ID ${id}`);
    try {
      const user = await this.usersService.remove(+id);
      this.logger.info(`User with ID ${id} removed successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Error removing user with ID ${id}`, error);
      throw new BadRequestException(`Failed to remove user with ID ${id}`);
    }
  }
}
