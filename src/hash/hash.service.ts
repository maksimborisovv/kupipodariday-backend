import { Injectable } from '@nestjs/common';
import { compare, genSaltSync, hash } from 'bcrypt';

@Injectable()
export class HashService {
  async getHash(password: string) {
    return hash(password, genSaltSync(10));
  }

  async comparePasswords(password: string, hash: string) {
    return compare(password, hash);
  }
}
