import {IsNotEmpty, IsString, IsNumber, isNotEmpty} from "class-validator";

export class CreateBalanceDto {
    @IsString()
    @IsNotEmpty({ message: 'Name must be a non-empty string' })
    name: string;

    @IsNumber()
    @IsNotEmpty({ message: 'amount is a not empty number' })
    amount: number;

    @IsString()
    description?: string
}
