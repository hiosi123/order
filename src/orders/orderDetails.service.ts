import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dtos/create-orderDetail.dto';
import { OrderDetail } from './entities/orderDetail.entity';
import { Order } from './entities/order.entity';


@Injectable()
export class OrderDetailsService {
    constructor(
        @InjectRepository(OrderDetail) private repo: Repository<OrderDetail>,
    ){}

    create(orderDetailDto: Partial<OrderDetail>, order: Order) {
        const {orderDetailId, createdAt, ...dataWithoutId} = orderDetailDto

        const orderDetail = this.repo.create(dataWithoutId)
        if (!orderDetail.status) {
            orderDetail.status = 1
        }
        orderDetail.order = order
        return this.repo.save(orderDetail);
    }

    // 트랜잭션용 메서드 (EntityManager 사용)
    createWithManager(
        orderDetailDto: Partial<OrderDetail>, 
        order: Order, 
        manager: EntityManager
    ) {
        const {orderDetailId, createdAt, ...dataWithoutId} = orderDetailDto

        const orderDetail = manager.create(OrderDetail, dataWithoutId)
        if (!orderDetail.status) {
            orderDetail.status = 2
        }
        orderDetail.order = order
        return manager.save(orderDetail);
    }

}