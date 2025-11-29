// orders/dtos/confirm-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class ConfirmOrderDto {
    @ApiProperty({
        description: '직원 ID (자동 설정됨)',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        required: false,
    })
    @IsString()
    employeeId: string;
}