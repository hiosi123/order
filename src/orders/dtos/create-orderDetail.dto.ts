import { IsNumber, IsString } from "class-validator";


export class CreateOrderDetailDto {
    @IsString()
    productName: string;
    
    @IsNumber()
    quantity: number;
    
    @IsNumber()
    unitPrice: number;
    
    @IsString()
    color: string;
    
    @IsString()
    size: string;
    
    @IsString()
    dueDate: string;
}
