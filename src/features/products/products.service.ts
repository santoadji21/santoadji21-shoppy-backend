import {
  CreateProductDto,
  UpdateProductDto,
} from '@/features/products/dto/product.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    return await this.prismaService.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    });
  }

  async findAll() {
    const products = await this.prismaService.product.findMany();
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  async findOne(id: number) {
    return await this.prismaService.product.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({ where: { id } });
  }

  async getProductsByUser(userId: number) {
    return await this.prismaService.product.findMany({
      where: {
        userId,
      },
    });
  }

  private async imageExists(productId: number) {
    try {
      await fs.access(
        join(__dirname, '../../', `public/products/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch (err) {
      return false;
    }
  }
}
