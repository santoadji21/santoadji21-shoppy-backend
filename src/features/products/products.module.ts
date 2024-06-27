import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '@/prisma/prisma.service';
import { FileUtilsService } from '@/features/products/file.service';

@Module({
  imports: [ProductsModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, FileUtilsService],
  exports: [ProductsService],
})
export class ProductsModule {}
