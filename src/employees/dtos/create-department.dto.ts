import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateDepartmentDto {
    @ApiProperty({
        description: '부서명',
        example: '소싱팀',
    })
    @IsString()
    departmentName: string;

    @ApiProperty({
        description: '부서 코드',
        example: 'S1',
    })
    @IsString()
    departmentCode: string;
}
