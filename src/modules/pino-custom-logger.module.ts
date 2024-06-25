import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get('NODE_ENV') === 'production' || true;
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                // singleLine: true,
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class PinoCustomLoggerModule {}
