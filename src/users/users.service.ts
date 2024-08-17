import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;

    const isExists = await this.userRepo.exists({
      where: [{ username }, { email }],
    });

    if (isExists) {
      throw new ConflictException(
        'Пользователь с таким username или email уже существует',
      );
    }

    const password = await this.hashService.getHash(createUserDto.password);

    const newUser = await this.userRepo.save({
      username: createUserDto.username,
      about: createUserDto.about,
      avatar: createUserDto.avatar,
      email: createUserDto.email,
      password: password,
    });

    delete newUser.password;

    return newUser;
  }

  async findByUsername(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(
        'Пользователя с таким username не существует',
      );
    }

    delete user.password;

    return user;
  }

  findByEmail(email: string) {
    const user = this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Пользователь с таким email не существует');
    }

    return user;
  }

  findById(id: number) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  findMany(query: string) {
    const users = this.userRepo.find({
      where: [{ username: query }, { email: query }],
    });

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, username } = updateUserDto;

    const userWithEmail = await this.userRepo.findOne({
      where: { email },
    });

    if (userWithEmail && userWithEmail.id !== id) {
      throw new ConflictException('Этот email уже занят');
    }

    const userWithUsername = await this.userRepo.findOne({
      where: { username },
    });

    if (userWithUsername && userWithUsername.id !== id) {
      throw new ConflictException('Этот username уже занят');
    }

    return this.userRepo.update({ id }, updateUserDto);
  }

  async findWishes(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { wishes: true },
    });

    return user.wishes;
  }
}
