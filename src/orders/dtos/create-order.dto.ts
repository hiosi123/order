import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "./create-orderDetail.dto";

export class CreateOrderDto {
    @IsString()
    buyerId: string


    @ValidateNested()
    @Type(() => CreateOrderDetailDto)
    orderDetail: CreateOrderDetailDto;
}