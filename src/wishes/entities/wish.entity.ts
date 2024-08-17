import { IsDate, IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

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
