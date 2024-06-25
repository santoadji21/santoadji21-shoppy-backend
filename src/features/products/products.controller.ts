import { ZodValidation } from '@/common/decorators/zod-decorators';
import { CurrentUser } from '@/features/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { TokenPayload } from '@/features/auth/schema/token.schema';
import {
  CreateProductDto,
  ProductSchema,
  UpdateProductDto,
} from '@/features/products/dto/product.dto';
import { ProductsService } from '@/features/products/products.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @InjectPinoLogger() private readonly logger: PinoLogger,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ZodValidation(ProductSchema)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: TokenPayload,
  ) {
    try {
      this.logger.info('Creating a new product');
      this.logger.debug(JSON.stringify(createProductDto));
      const product = await this.productsService.create(
        createProductDto,
        user.userId,
      );
      return product;
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }

  @Get()
  async findAll() {
    try {
      const products = await this.productsService.findAll();
      return products;
    } catch (error) {
      this.logger.error(`Failed to find all products: ${error.message}`);
      throw error;
    }
  }

  @Get('details/:id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(+id);
      return product;
    } catch (error) {
      this.logger.error(
        `Failed to find product with id ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: {
        destination: diskStorage({
          destination: 'public/products',
          filename: (req, file, cb) => {
            const filename = `${req.params.id}-${Date.now()}-${extname(
              file.originalname,
            )}`;
            cb(null, filename);
          },
        }),
      },
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    ) // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _file: Express.Multer.File,
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ZodValidation(ProductSchema)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      this.logger.info(`Updating product with id ${id}`);
      this.logger.debug(`Update data: ${JSON.stringify(updateProductDto)}`);
      const product = await this.productsService.update(+id, updateProductDto);
      return product;
    } catch (error) {
      this.logger.error(
        `Failed to update product with id ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      this.logger.info(`Removing product with id ${id}`);
      const result = await this.productsService.remove(+id);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to remove product with id ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
