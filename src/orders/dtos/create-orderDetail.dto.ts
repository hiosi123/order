// orders/dtos/create-orderDetail.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from "class-validator";

export class CreateOrderDetailDto {
    @ApiProperty({
        description: '제품명',
        example: '양말',
    })
    @IsString()
    productName: string;

    @ApiProperty({
        description: '수량',
        example: 1000,
    })
    @IsNumber()
    quantity: number;

    @ApiProperty({
        description: '단가',
        example: 10000,
    })
    @IsNumber()
    unitPrice: number;

    @ApiProperty({
        description: '색상',
        example: 'white',
    })
    @IsString()
    color: string;

    @ApiProperty({
        description: '사이즈',
        example: 'xl',
    })
    @IsString()
    size: string;

    @ApiProperty({
        description: '납기일 (YYYYMMDD)',
        example: '20251128',
    })
    @IsString()
    dueDate: string;
}