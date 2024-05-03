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
import { ClientProxy } from '@nestjs/microservices';

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
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationFilterDto: OrderPaginationFilterDto) {
    return this.client.send(
      { cmd: 'find_all_orders' },
      { ...orderPaginationFilterDto },
    );
  }

  @Get('status/:status')
  findOneById(
    @Param() status: OrderStatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client.send(
      { cmd: 'find_all_orders' },
      { ...status, ...paginationDto },
    );
  }

  @Get('id/:id')
  findOneByStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'find_one_order' }, { id });
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: OrderStatusDto,
  ) {
    return this.client.send({ cmd: 'change_status_order' }, { id, ...status });
  }
}
