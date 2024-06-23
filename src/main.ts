import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
