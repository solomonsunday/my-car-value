import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SigningKey } from 'ethers/lib/utils';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthsService: Partial<AuthService>;

  fakeUsersService = {
    findOne: (id: Number) => {
      return Promise.resolve({
        id,
        email: 'jest@jest.com',
        password: 'password',
      } as User);
    },
    find: (email: string) => {
      return Promise.resolve([{ id: 1, email, password: 'password' } as User]);
    },
    // remove: (id: Number) => {
    //   return Promise.resolve({
    //     id,
    //     email: 'jest@jest.com',
    //     password: 'password',
    //   } as User);
    // },
    // update: () => {},
  };

  fakeAuthsService = {
    // signIn: () => {},
    // signIn: () => {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        {
          provide: AuthService,
          useValue: fakeAuthsService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('finduser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
