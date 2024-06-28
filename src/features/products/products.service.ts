import {
  CreateProductDto,
  UpdateProductDto,
} from '@/features/products/dto/product.dto';
import { FileUtilsService } from '@/features/products/file.service';
import { ProductGateway } from '@/features/products/product.gateway';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileUtilsService,
    private readonly productGateway: ProductGateway,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const product = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    });
    this.productGateway.handleProductUpdated();
    return product;
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
    const updateProduct = await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
    this.productGateway.handleProductUpdated();
    return updateProduct;
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
