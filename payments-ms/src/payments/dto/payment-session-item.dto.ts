import { IsNumber, IsPositive, IsString } from 'class-validator';

export class PaymentsSessionItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
