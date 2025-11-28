
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Department } from "./department.entity";
import { OrderDetail } from "src/orders/entities/orderDetail.entity";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;

    @Column()
    employeeName: string;

    @Column()
    dateOfBirth: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Department, (department) => department.employees)
    department: Department;

    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.employee)
    orderDetails: OrderDetail[];
}

