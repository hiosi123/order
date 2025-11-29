// auth/dtos/signup-employee.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class SignupEmployeeDto {
    @ApiProperty({
        description: '직원 이름',
        example: '김소싱',
    })
    @IsString()
    employeeName: string;

    @ApiProperty({
        description: '이메일',
        example: 'sourcing@company.com',
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
        example: '19900315',
    })
    @IsString()
    dateOfBirth: string;

    @ApiProperty({
        description: '부서 ID',
        example: 1,
    })
    @IsNumber()
    departmentId: number;
}