import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/user/user.entity';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './auth.guard';
import { JwtStrategy } from './oauth.strategy';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'oauth2' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fwfqwfwqFWEFWEF#FEVFASVedwvewovjwev',
      signOptions: { expiresIn: '1440m' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
