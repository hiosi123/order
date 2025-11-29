// buyers/entities/buyer.entity.ts
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Buyer {
    @ApiProperty({ description: '구매자 ID (UUID)', example: 'd694e14f-385b-47ec-b66c-62c9b3aca02f' })
    @PrimaryGeneratedColumn('uuid')
    buyerId: string;

    @ApiProperty({ description: '구매자 이름', example: '디자이너' })
    @Column()
    buyerName: string;

    @ApiProperty({ description: '생년월일 (YYYYMMDD)', example: '19951108' })
    @Column()
    dateOfBirth: string;

    @ApiProperty({ description: '이메일', example: 'design@gmail.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ description: '전화번호', example: '01020311883' })
    @Column()
    phone: string;

    @ApiHideProperty()
    @Column({ select: false })
    password: string;

    @ApiProperty({ description: '생성일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '수정일시' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: '주문 목록', type: () => [Order] })
    @OneToMany(() => Order, (order) => order.buyer)
    orders: Order[];
}