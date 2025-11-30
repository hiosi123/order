// orders/entities/orderDetail.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Employee } from "../../employees/entities/employee.entity";

@Entity()
export class OrderDetail {
    @ApiProperty({ description: '주문 상세 ID', example: 1 })
    @PrimaryGeneratedColumn()
    orderDetailId: number;

    @ApiProperty({ description: '제품명', example: '양말' })
    @Column()
    productName: string;

    @ApiProperty({ description: '수량', example: 1000 })
    @Column()
    quantity: number;

    @ApiProperty({ description: '단가', example: 10000 })
    @Column()
    unitPrice: number;

    @ApiProperty({ description: '색상', example: 'white' })
    @Column()
    color: string;

    @ApiProperty({ description: '사이즈', example: 'xl' })
    @Column()
    size: string;

    @ApiProperty({ description: '납기일 (YYYYMMDD)', example: '20251128' })
    @Column()
    dueDate: string;

    @ApiProperty({ 
        description: '상태 (2: PENDING, 3: APPROVED, 9: REJECTED)',
        example: 2,
    })
    @Column()
    status: number;

    @ApiProperty({ description: '생성일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '주문 정보', type: () => Order })
    @ManyToOne(() => Order, (order) => order.orderDetails)
    order: Order;

    @ApiProperty({ description: '담당 직원', type: () => Employee })
    @ManyToOne(() => Employee, (employee) => employee.orderDetails)
    employee: Employee;
}