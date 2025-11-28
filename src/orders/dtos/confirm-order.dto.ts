import { IsString } from "class-validator";


export class ConfirmOrderDto {
    @IsString()
    employeeId: string;
}