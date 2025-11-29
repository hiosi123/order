import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateDepartmentDto {

    @ApiPropertyOptional({
        description: '부서명',
        example: '소싱팀',
    })
    @IsString()
    @IsOptional()
    departmentName: string;


    @ApiPropertyOptional({
        description: '부서 코드',
        example: 'S1',
    })
    @IsString()
    @IsOptional()
    departmentCode: string;
}
