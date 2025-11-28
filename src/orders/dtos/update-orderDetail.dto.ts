import { IsNumber, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


export class UpdateOrderDetailDto {
    @IsOptional()
    @IsString()
    productName: string;
    
    @IsOptional()
    @IsNumber()
    quantity: number;
    
    @IsOptional()
    @IsNumber()
    unitPrice: number;
    
    @IsOptional()
    @IsString()
    color: string;
    
    @IsOptional()
    @IsString()
    size: string;
    
    @IsOptional()
    @IsString()
    dueDate: string;
}
