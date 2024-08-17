import { IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  amount: number;

  hidden: boolean;
}
