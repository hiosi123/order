import { IsEmail, IsString, Matches } from "class-validator";

export class CreateBuyerDto {
    @IsString()
    buyerName: string;

    @IsString()
    @Matches(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/)
    dateOfBirth: string;

    @IsString()
    phone: string;

    @IsEmail()
    email: string;
}
