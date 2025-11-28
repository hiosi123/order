import { Buyer } from "src/buyers/entities/buyer.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "./orderDetail.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    orderId: string;

    @Column({default: 2}) // 1: DRAFT 2: PENDING 3: CONFIRMED 4: IN_PRODUCTION 5: COMPLETED
    orderStatus: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Buyer, (buyer) => buyer.orders)
    buyer: Buyer;

    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
    orderDetails: OrderDetail[];
}

