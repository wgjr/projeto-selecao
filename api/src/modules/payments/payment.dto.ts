import { IsNotEmpty, IsString, IsNumber, isNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Name must be a non-empty string' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'description must be a non-empty string' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'amount is a not empty number' })
  amount: number;

  @IsNumber()
  @IsNotEmpty({ message: 'balanceId is a not empty number' })
  balanceId: number;
}
