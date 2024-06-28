import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '@/prisma/prisma.service';
import { FileUtilsService } from '@/features/products/file.service';
import { ProductGateway } from '@/features/products/product.gateway';
import { AuthModule } from '@/features/auth/auth.module';

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, FileUtilsService, ProductGateway],
  exports: [ProductsService],
})
export class ProductsModule {}
