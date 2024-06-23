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
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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
    this.logger.info(`Creating product for user ${user.userId}`);
    this.logger.debug(`Product data: ${JSON.stringify(createProductDto)}`);
    return this.productsService.create(createProductDto, user.userId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
