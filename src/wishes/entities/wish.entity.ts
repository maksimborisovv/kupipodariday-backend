import { IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from '../../base/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @IsString()
  @Column()
  @Length(1, 250)
  name: string;

  @IsString()
  @Column()
  link: string;

  @IsString()
  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'float',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;

  @Column({
    type: 'float',
    default: 0,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  raised: number;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    type: 'numeric',
    precision: 10,
    default: 0,
  })
  copied: number;
}
