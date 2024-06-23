import { UsersModule } from '@/features/users/users.module';
import { PinoCustomLoggerModule } from '@/modules/pino-custom-logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@/common/interceptor/response-interceptor';
import { AuthModule } from './features/auth/auth.module';
import { ProductsModule } from './features/products/products.module';

@Module({
  imports: [
    PinoCustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,

    PrismaModule,

    AuthModule,

    ProductsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
