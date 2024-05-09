import { Controller, Get, Post, Body, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NATS_SERVICE } from '../config';
import { LoginUserDto, RegisterUserDto, User as UserRequest } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  findOne(@User() user: UserRequest, @Token() token: string) {
    return { user, token };
  }
}
