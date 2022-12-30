import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { throws } from 'assert';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { id } from 'ethers/lib/utils';
import { NotFoundError } from 'rxjs';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private uesrService: UsersService) {}

  async signUp(email: string, password: string) {
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    //hash the salt and the user password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    //Create a new user and save it
    const user = await this.uesrService.create(email, result);

    //return the user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.uesrService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
