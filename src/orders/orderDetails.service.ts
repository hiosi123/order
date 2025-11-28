import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dtos/create-orderDetail.dto';
import { OrderDetail } from './entities/orderDetail.entity';
import { Order } from './entities/order.entity';


@Injectable()
export class OrderDetailsService {
    constructor(
        @InjectRepository(OrderDetail) private repo: Repository<OrderDetail>,
    ){}

    create(orderDetailDto: Partial<OrderDetail>, order: Order) {
        const {orderDetailId, ...dataWithoutId} = orderDetailDto

        const orderDetail = this.repo.create(dataWithoutId)
        if (!orderDetail.status) {
            orderDetail.status = 1
        }
        orderDetail.order = order
        return this.repo.save(orderDetail);
    }
}