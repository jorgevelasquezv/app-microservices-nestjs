import { PaginationDto } from './../common/dto/pagination.dto';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    const product = this.product.create({
      data: createProductDto,
    });

    return excludeKeys(product, ['available' as keyof typeof product]);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalItems = await this.product.count({ where: { available: true } });
    const totalPages = Math.ceil(totalItems / limit);

    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });

    return {
      data: products.map((product) => excludeKeys(product, ['available'])),
      metadata: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });
    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);
    return excludeKeys(product, ['available']);
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...updateProduct } = updateProductDto;

    await this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: updateProduct,
    });
    return excludeKeys(product, ['available']);
  }

  async remove(id: number) {
    await this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: { available: false },
    });
    return excludeKeys(product, ['available']);
  }
}

function excludeKeys<Product>(
  product: Product,
  keys: (keyof Product)[],
): Omit<Product, (typeof keys)[number]> {
  return Object.fromEntries(
    Object.entries(product).filter(
      ([key]) => !keys.includes(key as keyof Product),
    ),
  ) as Omit<Product, (typeof keys)[number]>;
}
