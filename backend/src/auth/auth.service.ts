import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UserSigninDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/shared/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { comparePassword, hashPassword } from '@/shared/functions/hash';
import { generateOTP } from '@/shared/functions/otp';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    // This is a constructor
  }
  /**
   * A function that is used to change the user password
   * @param param
   * @returns
   *
   */
  async resetPassword({
    email,
    otp,
    password,
  }: {
    email: string;
    otp: string;
    password: string;
  }) {
    const formattedUsernameOrEmail = email?.trim().toLocaleLowerCase();
    const user = await this.prismaService.user.findFirst({
      where: {
        email: formattedUsernameOrEmail,
      },
    });
    if (!user) throw new NotFoundException("User doesn't exists");

    const otpInDb = await this.prismaService.token.findFirst({
      where: {
        token: otp,
        role: 'ACCOUNT_RECOVERY',
        userId: user.id,
      },
    });
    if (!otpInDb) throw new NotAcceptableException('Invalid OTP');
    await this.prismaService.user.update({
      data: {
        password: hashPassword(password),
      },
      where: {
        id: user.id,
      },
    });
    return { message: 'Password was changed successfully' };
  }
  /**
   * A funcition that is used to send the authoriation token that can used to verify accunt or change user password
   * @param param0 A
   * @returns
   */
  async generateEmailOTP({
    email,
    role,
    title = 'Verification code',
    description,
  }: {
    email: string;
    role: string;
    title?: string;
    description?: string;
  }) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) throw new NotFoundException('User was not found');
    const otp = generateOTP();

    await this.prismaService.token.deleteMany({
      where: {
        userId: user.id,
        role: role,
      },
    });
    await this.prismaService.token.create({
      data: {
        token: otp,
        userId: user.id,
        role: role,
      },
    });

    return { message: 'Token was sent successfully' };
  }
  /**
   * A function that is used to verify the user acccount
   * @param param
   * @returns
   */
  async verifyUser({ email, otp }: { email: string; otp: string }) {
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('User with that username is not found');
    }
    const token = await this.prismaService.token.findFirst({
      where: {
        userId: user.id,
        token: otp,
        role: 'ACCOUNT_VERIFICATION',
      },
    });
    if (!token) throw new BadRequestException('Verification code is not valid');
    await this.prismaService.user.update({
      data: {
        verified: true,
      },
      where: {
        id: user.id,
      },
    });
    await this.prismaService.token.delete({
      where: {
        id: token.id,
      },
    });
    return { message: 'User account  was verified successfully' };
  }
  /**
   * A function that is used to check if the user acc
   * @param param
   * @returns
   */
  async validateUser({ email, password }: UserSigninDTO) {
    const formattedUsername = email.toLocaleLowerCase().trim();
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: formattedUsername,
          },
          {
            email: formattedUsername,
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        password: true,
        verified: true,
      },
    });
    if (!user || !comparePassword(password, user.password)) return null;
    if (!user.verified)
      throw new NotAcceptableException('Account not verified');
    return user;
  }
  /**
   * Used to login the user and return the user token
   * @param param0
   * @returns token{string}
   */
  async generateJWT({
    userId,
    firstName,
    role,
  }: {
    userId: string;
    firstName: string;
    role: string;
  }) {
    const token = this.jwtService.sign(
      {
        userId,
        firstName,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );

    return {
      token: token,
      role,
    };
  }

  async linkGoogleAccount(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const providers = user.provider?.split(',');
    providers.push('GOOGLE');
    await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        provider: providers.join(','),
      },
    });
  }
  async generateLoginNonce(userId: string) {
    const nonce = randomUUID();
    const token = await this.prismaService.token.create({
      data: {
        token: nonce,
        userId,
        role: 'NONCE',
      },
    });
    return token;
  }
  async findUserLoginNonce({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }) {
    const nonceToken = await this.prismaService.token.findFirst({
      where: {
        token,
        userId,
        role: 'NONCE',
      },
    });
    return nonceToken;
  }
  async deleteNonce(nonceTokenId: string) {
    await this.prismaService.token.delete({
      where: {
        id: nonceTokenId,
      },
    });
  }
}
