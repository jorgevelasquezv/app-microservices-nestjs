import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { ChangeOrderStatusDto, CreateOrderDto, PaidOrderDto } from './dto';
import { PaginationDto } from './common/dto';
import { NATS_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';
import { Product } from './entities/product.entity';
import { OrderWithProducts } from './interfaces';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger: Logger = new Logger(OrdersService.name);

  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    try {
      const productIds: number[] = items.map((item) => item.productId);

      const products: Product[] = await firstValueFrom(
        this.client.send({ cmd: 'validate_products' }, productIds),
      );

      const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
      const totalAmount = items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.productId);
        return acc + product.price * item.quantity;
      }, 0);

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          orderItems: {
            createMany: {
              data: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: products.find((p) => p.id === item.productId).price,
              })),
            },
          },
        },
        include: {
          orderItems: {
            select: {
              quantity: true,
              price: true,
              productId: true,
            },
          },
        },
      });
      console.log({ orderItemsInService: order.orderItems });

      return {
        ...order,
        orderItems: order.orderItems.map((item) => ({
          ...item,
          name: products.find((p) => p.id === item.productId).name,
        })),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, status } = paginationDto;
    const totalItems = await this.order.count({ where: { status } });
    const totalPages = Math.ceil(totalItems / limit);
    const orders = await this.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { status },
    });
    return {
      data: orders,
      metadata: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          select: {
            quantity: true,
            price: true,
            productId: true,
          },
        },
      },
    });

    if (!order)
      throw new RpcException({
        statusCode: 404,
        message: `Order with id ${id} not found`,
      });

    const products: Product[] = await firstValueFrom(
      this.client.send(
        { cmd: 'validate_products' },
        order.orderItems.map((item) => item.productId),
      ),
    );

    return {
      ...order,
      orderItems: order.orderItems.map(
        (item) =>
          ({ ...item, name: products.find((p) => p.id === item.productId) })
            .name,
      ),
    };
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    if (order.status === status) return order;
    return this.order.update({
      where: { id },
      data: { status },
    });
  }

  async createPaymentSession(order: OrderWithProducts) {
    const { id, orderItems } = order;

    const payload = {
      orderId: id,
      currency: 'usd',
      items: orderItems.map(({ name, price, quantity }) => ({
        name,
        quantity,
        price,
      })),
    };
    console.log({ payload });

    const paymentSession = await firstValueFrom(
      this.client.send('create.payment.session', payload),
    );
    return paymentSession;
  }

  async paidOrder(paidOrderDto: PaidOrderDto) {
    const { orderId, stripePaymentId, receiptUrl } = paidOrderDto;

    const order = await this.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paid: true,
        paidAt: new Date(),
        stripeChargeId: stripePaymentId,
        OrderReceipt: {
          create: {
            receiptUrl,
          },
        },
      },
    });

    return order;
  }
}
