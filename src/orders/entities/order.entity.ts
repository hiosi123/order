// orders/entities/order.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Buyer } from "../../buyers/entities/buyer.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./orderDetail.entity";

@Entity()
export class Order {
    @ApiProperty({ description: '주문 ID (UUID)', example: '57ba651c-230d-418c-acbf-187b05307504' })
    @PrimaryGeneratedColumn('uuid')
    orderId: string;

    @ApiProperty({ 
        description: '주문 상태 (1: DRAFT, 2: PENDING, 3: CONFIRMED, 4: IN_PRODUCTION, 5: COMPLETED)',
        example: 2,
        default: 2,
    })
    @Column({ default: 2 })
    orderStatus: number;

    @ApiProperty({ description: '생성일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '구매자 정보', type: () => Buyer })
    @ManyToOne(() => Buyer, (buyer) => buyer.orders)
    buyer: Buyer;

    @ApiProperty({ description: '주문 상세 목록', type: () => [OrderDetail] })
    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
    orderDetails: OrderDetail[];
}