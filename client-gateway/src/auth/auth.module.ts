import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NastServerModule } from 'src/transports/nast-server.module';

@Module({
  controllers: [AuthController],
  imports: [NastServerModule],
})
export class AuthModule {}
