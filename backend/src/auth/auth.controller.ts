import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  UserSignupDTO,
  RequestOTP,
  ResetPassordDTO,
  VerifyProfileDTO,
  UserSigninDTO,
  NonceDTO,
} from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { GoogleOAuthGuard } from './guards/google.guard';

import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { generateOTP } from '@/shared/functions/otp';
import { Public } from '@/shared/decorators';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    // this is a constructor
  }
  @Post('signup')
  @ApiResponse({
    status: 400,
    description: 'Invalid user data',
  })
  @ApiResponse({
    status: 409,
    description: 'Entry already exists',
  })
  @Public()
  async handleSignup(@Body() userSignupDto: UserSignupDTO): Promise<unknown> {
    const user = await this.userService.addUser(userSignupDto);
    return user;
  }

  @Post('/forgot-password')
  @Public()
  async handleRequestResetToken(@Body() { email }: RequestOTP) {
    return this.authService.generateEmailOTP({
      email,
      title: 'Reset token',
      role: 'ACCOUNT_RECOVERY',
      description: 'Use this token to reset your password',
    });
  }

  @Post('/verification-email')
  @Public()
  async resendVerificationEmail(@Body() { email }: RequestOTP) {
    return this.authService.generateEmailOTP({
      email,
      role: 'ACCOUNT_VERIFICATION',
    });
  }

  @Patch('/verification')
  @Public()
  async verifyUser(@Body() { email, otp }: VerifyProfileDTO) {
    return this.authService.verifyUser({
      email,
      otp,
    });
  }

  @Patch('/forgot-password')
  @Public()
  async resetPassword(@Body() { otp, email, password }: ResetPassordDTO) {
    return this.authService.resetPassword({
      email,
      otp,
      password,
    });
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  @Throttle({ default: { limit: 15, ttl: 30000 } })
  @Public()
  async handleSignin(@Req() req, @Body() _user: UserSigninDTO) {
    return this.authService.generateJWT({
      userId: req.user.id,
      firstName: req.user.firstName,
      role: req.user.role,
    });
  }
  @UseGuards(AuthGuard('google'))
  @Get('/google')
  @Public()
  handleGoogleLogin() {
    //handle google login with passport
  }

  @Get('/google/redirect')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  async handleGoogleRedirect(@Req() req, @Res() res) {
    const googleProfile = req.user;
    let user = await this.userService.findUserBy({
      email: googleProfile.email,
    });
    if (!user) {
      user = await this.userService.addUser({
        email: googleProfile.email,
        firstName: googleProfile.firstName,
        lastName: googleProfile.lastName,
        password: null,

        pictureUrl: googleProfile.picture,
        provider: 'GOOGLE',
      }); // add user to the database
      // Link the account to the google account
    }
    if (!user.provider.split(',').includes('GOOGLE')) {
      await this.authService.linkGoogleAccount(googleProfile.email);
    }
    const nonceToken = await this.authService.generateLoginNonce(user.id);
    return res.redirect(
      `${this.configService.get('FRONTEND_URL')}/auth-callback?nonce=${
        nonceToken.token
      }_${nonceToken.userId}`,
    );
  }
  @Post('nonce')
  @Public()
  async loginWithNonce(@Body() { nonce }: NonceDTO) {
    const [token, userId] = nonce.split('_');
    const user = await this.userService.findUserBy({ id: userId });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const nonceToken = await this.authService.findUserLoginNonce({
      userId,
      token,
    });
    if (!nonceToken) throw new UnauthorizedException('Invalid credentials');
    const loginToken = await this.authService.generateJWT({
      userId,
      firstName: user.firstName,
      role: user.role,
    });
    await this.authService.deleteNonce(nonceToken.id);
    return loginToken;
  }
}
