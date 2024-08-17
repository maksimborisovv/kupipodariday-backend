import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async auth(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validate(username: string, userPassword: string) {
    const user = await this.usersService.findByUsername(username);

    if (
      !user ||
      !this.hashService.comparePasswords(userPassword, user.password)
    ) {
      return null;
    }

    delete user.password;

    return user;
  }
}
