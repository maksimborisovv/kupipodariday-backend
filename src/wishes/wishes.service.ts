import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepo: Repository<Wish>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto) {
    const user = await this.userRepo.findOneBy({ id: userId });

    const newWish = await this.wishRepo.save({
      ...createWishDto,
      owner: user,
    });

    return newWish;
  }

  findLast() {
    return this.wishRepo.find({
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 40,
    });
  }

  findTop() {
    return this.wishRepo.find({
      order: { copied: 'DESC' },
      skip: 0,
      take: 20,
    });
  }

  async findOneById(id: number) {
    const wish = await this.wishRepo.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    if (!wish) {
      throw new NotFoundException('Такой подарок не существует :(');
    }

    return wish;
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepo.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Такой подарок не существует :(');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Недостаточно прав на изменение этого подарка',
      );
    }

    return this.wishRepo.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepo.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Такой подарок не существует :(');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Недостаточно прав на изменение этого подарка',
      );
    }

    return this.wishRepo.remove(wish);
  }

  async copy(id: number, userId: number) {
    const wish = await this.wishRepo.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Такой подарок не существует :(');
    }

    if (wish.owner.id === userId) {
      throw new ConflictException('У пользователя такой подарок уже есть');
    }

    return this.create(userId, {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    });
  }
}
