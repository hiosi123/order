
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { Department } from "./department.entity";
import { OrderDetail } from "src/orders/entities/orderDetail.entity";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

@Entity()
export class Employee {
    @ApiProperty({ description: '직원 ID (UUID)', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;

    @ApiProperty({ description: '직원 이름', example: '김소싱' })
    @Column()
    employeeName: string;

    @ApiProperty({ description: '생년월일 (YYYYMMDD)', example: '19900315' })
    @Column()
    dateOfBirth: string;

    @ApiProperty({ description: '이메일', example: 'sourcing@company.com' })
    @Column({unique: true})
    email: string;

    @ApiHideProperty()  // Swagger에서 숨김
    @Column({select: false})
    password: string;

    @ApiProperty({ description: '생성일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '수정일시' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: '소속 부서', type: () => Department })
    @ManyToOne(() => Department, (department) => department.employees)
    department: Department;

    @ApiProperty({ description: '담당 주문 상세 목록', type: () => [OrderDetail] })
    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.employee)
    orderDetails: OrderDetail[];
}

