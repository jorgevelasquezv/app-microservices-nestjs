import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class CreateOrderDto {
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  @Type(() => Number)
  totalAmount: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  @Type(() => Number)
  totalItems: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
