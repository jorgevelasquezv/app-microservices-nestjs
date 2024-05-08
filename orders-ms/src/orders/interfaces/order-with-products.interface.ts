import { OrderStatus } from '@prisma/client';
import { OrderItem } from './order-item.interface';

export interface OrderWithProducts {
  orderItems: OrderItem[];
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
