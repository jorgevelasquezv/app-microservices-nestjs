import { firstValueFrom } from 'rxjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import {
  CreateOrderDto,
  OrderPaginationFilterDto,
  OrderStatusDto,
} from './dto';
import { NATS_SERVICE } from '../config';
import { PaginationDto } from '../common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'create_order' }, createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() orderPaginationFilterDto: OrderPaginationFilterDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send(
          { cmd: 'find_all_orders' },
          { ...orderPaginationFilterDto },
        ),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('status/:status')
  async findAllByStatus(
    @Param() status: OrderStatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const orders = await firstValueFrom(
        this.client.send(
          { cmd: 'find_all_orders' },
          { ...status, ...paginationDto },
        ),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOneById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'find_one_order' }, { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: OrderStatusDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'change_status_order' }, { id, ...status }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
