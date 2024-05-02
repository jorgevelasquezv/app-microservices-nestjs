import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class OrderStatusDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}
