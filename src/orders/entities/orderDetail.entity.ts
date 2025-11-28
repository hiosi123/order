import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";
import { Employee } from "src/employees/entities/employee.entity";

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn()
    orderDetailId: number;

    @Column()
    productName: string;

    @Column()
    quantity: number;

    @Column()
    unitPrice: number;

    @Column()
    color: string;

    @Column()
    size: string;

    @Column()
    dueDate: string;

    @Column() // 2:PENDING 3: APPROVED 9: REJECTED
    status: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Order, (order) => order.orderDetails)
    order: Order;

    @ManyToOne(() => Employee, (employee) => employee.orderDetails)
    employee: Employee;
}