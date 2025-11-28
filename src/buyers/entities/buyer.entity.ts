import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Buyer {
    @PrimaryGeneratedColumn('uuid')
    buyerId: string;

    @Column()
    buyerName: string;

    @Column()
    dateOfBirth: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Order, (order) => order.buyer)
    orders: Order[];    
}