import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentsSessionItemDto } from './payment-session-item.dto';

export class PaymentSessionDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentsSessionItemDto)
  items: PaymentsSessionItemDto[];
}
