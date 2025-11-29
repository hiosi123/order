// buyers/dtos/create-buyer.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateBuyerDto {
    @ApiProperty({
        description: '구매자 이름',
        example: '디자이너',
    })
    @IsString()
    buyerName: string;

    @ApiProperty({
        description: '생년월일 (YYYYMMDD)',
        example: '19951108',
        pattern: '^\\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])$',
    })
    @IsString()
    @Matches(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/)
    dateOfBirth: string;

    @ApiProperty({
        description: '전화번호',
        example: '01020311883',
    })
    @IsString()
    phone: string;

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
}