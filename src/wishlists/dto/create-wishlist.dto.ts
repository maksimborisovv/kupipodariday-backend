import { IsArray, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemIds: number[];
}
