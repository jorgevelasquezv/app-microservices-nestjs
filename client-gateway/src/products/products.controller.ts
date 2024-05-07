import { PaginationDto } from 'src/common';
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Body,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '../config';
import { CreateProductDto, UpdateProductDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'create_product' }, { ...createProductDto }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async getProducts(@Query() paginationDto: PaginationDto) {
    try {
      const products = await firstValueFrom(
        this.client.send({ cmd: 'find_all_products' }, { ...paginationDto }),
      );
      return products;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'find_one_product' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await firstValueFrom(
        this.client.send(
          { cmd: 'update_product' },
          { id, ...updateProductDto },
        ),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = this.client.send({ cmd: 'remove_product' }, { id });
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
