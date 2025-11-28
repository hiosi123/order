import { IsEmail, IsInt, IsString, Matches, Max, Min } from "class-validator";

export class UpdateEmployeeDto {
    @IsString()
    employeeName: string;

    @IsString()
    @Matches(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/)
    dateOfBirth: string;

    @IsEmail()
    email: string;

    @IsString()
    userId: string;

    @IsString()
    @Min(6)
    @Max(12)
    password: string;

    @IsInt()
    departmentId: number;
}