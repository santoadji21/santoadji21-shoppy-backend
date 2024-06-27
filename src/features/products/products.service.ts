import {
  CreateProductDto,
  UpdateProductDto,
} from '@/features/products/dto/product.dto';
import { FileUtilsService } from '@/features/products/file.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileUtilsService,
  ) {}

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
        imageExists: await this.fileService.imageExists(product.id),
      })),
    );
  }

  async findOne(id: number) {
    try {
      const product = await this.prismaService.product.findUniqueOrThrow({
        where: { id },
      });

      const imagePath = await this.fileService.getImagePath(id);

      return {
        ...product,
        imagePath,
      };
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
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
}
