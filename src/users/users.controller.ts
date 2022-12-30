import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user-decorator';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdatUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  //   @Get('/colors/:color')
  //   setColor(@Param('color') color: string, @Session() session: any) {
  //     session.color = color;
  //   }

  //   @Get('/colors')
  //   getColor(@Session() session: any) {
  //     return session.color;
  //   }

  //   @Get('/whoami')
  //   whoAmI(@Session() session: any) {
  //     return this.usersService.findOne(session.userId);
  //   }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoami(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createuser(@Body() body: CreateUsersDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUsersDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.id = user.id;
    return user;
  }

  //   @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdatUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
