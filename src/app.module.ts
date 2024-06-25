import { UsersModule } from '@/features/users/users.module';
import { PinoCustomLoggerModule } from '@/modules/pino-custom-logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor } from '@/common/interceptor/response-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@/features/auth/auth.module';
import { ProductsModule } from '@/features/products/products.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PinoCustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
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
