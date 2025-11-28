import { IsString, ValidateNested } from "class-validator";
import { UpdateOrderDetailDto } from "./update-orderDetail.dto";
import { Type } from "class-transformer";

export class UpdateOrderDto {
    @IsString()
    buyerId: string;

    @ValidateNested()
    @Type(() => UpdateOrderDetailDto)
    orderDetail: UpdateOrderDetailDto
}