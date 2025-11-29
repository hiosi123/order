// orders/dtos/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "./create-orderDetail.dto";

export class CreateOrderDto {
    @ApiProperty({
        description: '구매자 ID (자동 설정됨)',
        example: 'd694e14f-385b-47ec-b66c-62c9b3aca02f',
        required: false,
    })
    @IsString()
    buyerId: string;

    @ApiProperty({
        description: '주문 상세 정보',
        type: CreateOrderDetailDto,
    })
    @ValidateNested()
    @Type(() => CreateOrderDetailDto)
    orderDetail: CreateOrderDetailDto;
}