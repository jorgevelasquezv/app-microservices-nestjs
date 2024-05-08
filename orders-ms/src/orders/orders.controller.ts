import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from './common/dto';
import { ChangeOrderStatusDto, PaidOrderDto } from './dto';
import { OrderWithProducts } from './interfaces/order-with-products.interface';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order: OrderWithProducts =
      await this.ordersService.create(createOrderDto);
    console.log(order);

    const paymentSession = await this.ordersService.createPaymentSession(order);
    return { order, paymentSession };
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_one_order' })
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_status_order' })
  changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.changeStatus(changeOrderStatusDto);
  }

  @EventPattern('payment.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    return this.ordersService.paidOrder(paidOrderDto);
  }
}
