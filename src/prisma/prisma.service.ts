import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @InjectPinoLogger(PrismaService.name) private readonly logger: PinoLogger,
  ) {
    super({
      log: ['query', 'info', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.info('Successfully connected to the database.');
    } catch (error) {
      this.logger.error(error);
      this.logger.error('Failed to connect to the database.', error);
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
