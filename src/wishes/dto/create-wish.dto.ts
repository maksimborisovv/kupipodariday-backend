import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;

  @Length(1, 1024)
  @IsString()
  description: string;
}
