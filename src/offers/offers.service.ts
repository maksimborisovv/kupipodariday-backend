import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepo: Repository<Offer>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Wish) private wishRepo: Repository<Wish>,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    const { itemId } = createOfferDto;

    const wish = await this.wishRepo.findOne({
      where: {
        id: itemId,
      },
      relations: {
        owner: true,
      },
    });

    if (!wish) {
      throw new BadRequestException('Такой подарок не найден');
    }

    if (wish.owner.id === userId) {
      throw new BadRequestException(
        'Необходимо выбрать подарок для другого пользователя',
      );
    }

    const newRaised = wish.raised + createOfferDto.amount;

    if (newRaised > wish.price) {
      throw new BadRequestException('Общая сумма превышает стоимость');
    }

    this.wishRepo.update(wish.id, { raised: newRaised });

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { wishes: true },
    });

    return this.offerRepo.save({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      user: user,
      item: wish,
    });
  }

  findAll() {
    return this.offerRepo.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async findById(id: number) {
    const offer = await this.offerRepo.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offer) {
      throw new NotFoundException('Такой оффер не существует');
    }

    return offer;
  }
}
