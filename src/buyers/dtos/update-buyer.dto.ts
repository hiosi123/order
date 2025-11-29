// buyers/dtos/update-buyer.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class UpdateBuyerDto {
    @ApiPropertyOptional({
        description: '구매자 이름',
        example: '디자이너',
    })
    @IsString()
    @IsOptional()
    buyerName?: string;

    @ApiPropertyOptional({
        description: '생년월일 (YYYYMMDD)',
        example: '19951108',
        pattern: '^\\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])$',
    })
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/)
    dateOfBirth?: string;

    @ApiPropertyOptional({
        description: '전화번호',
        example: '01020311883',
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({
        description: '이메일',
        example: 'design@gmail.com',
    })
    @IsEmail()
    @IsOptional()
    email?: string;
}