// auth/dtos/singin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class SigninDto {
    @ApiProperty({
        description: '이메일',
        example: 'design@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: '비밀번호',
        example: 'password123',
    })
    @IsString()
    password: string;
}