import { IsString, IsUrl, Length, MaxLength } from 'class-validator';
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
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @MaxLength(1500)
  @IsString()
  description: string;

  @Column()
  @IsString()
  @IsUrl()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
