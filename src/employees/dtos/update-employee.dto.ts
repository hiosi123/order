import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsOptional, IsString, Matches, Max, Min } from "class-validator";

export class UpdateEmployeeDto {
    @ApiPropertyOptional({
        description: '직원 이름',
        example: '김소싱',
    })
    @IsString()
    @IsOptional()
    employeeName?: string;

    @ApiPropertyOptional({
        description: '생년월일 (YYYYMMDD 형식)',
        example: '19900315',
        pattern: '^\\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])$',
    })
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/)
    dateOfBirth?: string;

    @ApiPropertyOptional({
        description: '이메일',
        example: 'sourcing@company.com',
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: '비밀번호 (최소 8자)',
        example: 'password123',
        minLength: 8,
    })
    @IsString()
    @IsOptional()
    @Min(8)
    password?: string;

    @ApiPropertyOptional({
        description: '부서 ID',
        example: 1,
    })
    @IsInt()
    @IsOptional()
    departmentId?: number;
}