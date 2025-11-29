// auth/dtos/signup-buyer.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignupBuyerDto {
    @ApiProperty({
        description: '구매자 이름',
        example: '디자이너',
    })
    @IsString()
    buyerName: string;

    @ApiProperty({
        description: '이메일',
        example: 'design@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: '비밀번호 (최소 8자)',
        example: 'password123',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({
        description: '생년월일 (YYYYMMDD)',
        example: '19951108',
    })
    @IsString()
    dateOfBirth: string;

    @ApiProperty({
        description: '전화번호',
        example: '01020311883',
    })
    @IsString()
    phone: string;
}