import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { fileURLToPath } from 'url';
import { serialize } from 'v8';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the user service
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with salt and hashed password', async () => {
    const user = await service.signUp('jest@jest.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('session@gmail.com', 'password');
    await expect(
      service.signUp('session@gmail.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signIn('schinoyerem007@gmail.com', '!Pass4sure'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('hbekjee@jhelke.com', 'password');

    await expect(
      service.signIn('hbekjee@jhelke.com', 'fhfjkejrke'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provieded', async () => {
    await service.signUp('schinoyerem007@gmail.com', 'password');

    const user = await service.signIn('schinoyerem007@gmail.com', 'password');
    expect(user).toBeDefined();
  });
});
