import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '@/user/user.service';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [
    UserService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [GoogleStrategy, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
