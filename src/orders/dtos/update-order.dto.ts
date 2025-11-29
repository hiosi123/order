// orders/dtos/update-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from "class-validator";
import { UpdateOrderDetailDto } from "./update-orderDetail.dto";
import { Type } from "class-transformer";

export class UpdateOrderDto {
    @ApiProperty({
        description: '구매자 ID (자동 설정됨)',
        example: 'd694e14f-385b-47ec-b66c-62c9b3aca02f',
        required: false,
    })
    @IsString()
    buyerId: string;

    @ApiProperty({
        description: '수정할 주문 상세 정보',
        type: UpdateOrderDetailDto,
    })
    @ValidateNested()
    @Type(() => UpdateOrderDetailDto)
    orderDetail: UpdateOrderDetailDto;
}