import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Wish) private wishRepo: Repository<Wish>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const { itemIds } = createWishlistDto;
    const items = await this.wishRepo.find({
      where: { id: In(itemIds) },
    });

    const owner = await this.userRepo.findOne({
      where: { id: userId },
    });

    return this.wishlistRepo.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: owner,
      items: items,
    });
  }

  findAll() {
    return this.wishlistRepo.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  findById(id: number) {
    return this.wishlistRepo.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistRepo.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new BadRequestException('Такой вишлист не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Недостаточно прав для редактирования этого вишлиста',
      );
    }

    const { itemIds } = updateWishlistDto;
    const items = await this.wishRepo.find({
      where: { id: In(itemIds) },
    });

    return this.wishlistRepo.save({
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: items,
    });
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.wishlistRepo.findOne({ where: { id } });

    if (!wishlist) {
      throw new BadRequestException('Такой вишлист не существует');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Недостаточно прав для удаления этого вишлиста',
      );
    }

    return this.wishlistRepo.remove(wishlist);
  }
}
