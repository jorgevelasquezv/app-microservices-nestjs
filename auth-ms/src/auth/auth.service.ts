import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  async signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, name } = registerUserDto;

    try {
      const userExist = await this.findUser(email);

      if (userExist) this.handleException(400, 'User already exists');

      const user = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = await this.signJwt({ id: user.id });

      return {
        user,
        token,
      };
    } catch (error) {
      this.handleException(400, error.message);
    }
  }

  private async findUser(email: string) {
    return await this.user.findUnique({
      where: {
        email,
      },
    });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      const user = await this.findUser(email);

      if (!user) this.handleException();

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) this.handleException();

      delete user.password;

      const token = await this.signJwt({ id: user.id });

      return {
        user,
        token,
      };
    } catch (error) {
      this.handleException(400, error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const { id } = this.jwtService.verify<JwtPayload>(token, {
        secret: envs.jwtSecret,
      });

      const user = await this.user.findUnique({
        where: {
          id: id,
        },
      });

      delete user.password;

      return { user, token: await this.signJwt({ id: user.id }) };
    } catch (error) {
      this.handleException(401, 'Invalid Token');
    }
  }

  handleException(
    statusCode: number = 400,
    message: string = 'Invalid Credentials',
  ) {
    throw new RpcException({
      statusCode,
      message,
    });
  }
}
