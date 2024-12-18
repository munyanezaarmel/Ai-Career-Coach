import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserSigninDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'user',
  })
  password: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'user@example.com',
  })
  email: string;
}

export class ResetPassordDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'John',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'NewPassword@01',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: '112233',
  })
  otp: string;
}
export class UserSignupDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'John',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'Doe',
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'john1',
  })
  password: string;
  @IsEmail()
  @IsString()
  @ApiProperty({
    default: 'example@gmail.com',
  })
  email: string;
}
export class VerifyProfileDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'John',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: '112233',
  })
  otp: string;
}
export class RequestOTP {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'John',
  })
  email: string;
}
export class NonceDTO {
  @IsNotEmpty()
  //two combined uuid with _
  @Matches(/^[\da-f_\-]{70,78}$/, {
    message: 'Invalid nonce',
  })
  @ApiProperty()
  nonce: string;
}
