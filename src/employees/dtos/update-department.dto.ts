import { IsString } from "class-validator";

export class UpdateDepartmentDto {
    @IsString()
    departmentName: string;

    @IsString()
    departmentCode: string;
}
