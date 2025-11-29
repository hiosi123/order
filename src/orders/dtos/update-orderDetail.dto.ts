// orders/dtos/update-orderDetail.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateOrderDetailDto {
    @ApiPropertyOptional({
        description: '제품명',
        example: '양말',
    })
    @IsOptional()
    @IsString()
    productName?: string;
    
    @ApiPropertyOptional({
        description: '수량',
        example: 1500,
    })
    @IsOptional()
    @IsNumber()
    quantity?: number;
    
    @ApiPropertyOptional({
        description: '단가',
        example: 15000,
    })
    @IsOptional()
    @IsNumber()
    unitPrice?: number;
    
    @ApiPropertyOptional({
        description: '색상',
        example: 'green',
    })
    @IsOptional()
    @IsString()
    color?: string;
    
    @ApiPropertyOptional({
        description: '사이즈',
        example: 'xl',
    })
    @IsOptional()
    @IsString()
    size?: string;
    
    @ApiPropertyOptional({
        description: '납기일 (YYYYMMDD)',
        example: '20251230',
    })
    @IsOptional()
    @IsString()
    dueDate?: string;
}