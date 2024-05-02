import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  totalAmount: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  totalItems: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;
}
