import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MaxDate,
} from 'class-validator';

export class UserProfileDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  pronouns?: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date())
  @ApiProperty({
    default: '07/07/1999',
  })
  dateOfBirth: Date;

  @IsString()
  @ApiProperty()
  @IsOptional()
  location?: string;
  @IsString()
  @ApiProperty()
  website?: string;
  @IsArray()
  @IsOptional()
  @ApiProperty()
  socialLinks?: string[];
  @IsString()
  @ApiProperty()
  @IsOptional()
  bio?: string;
}
export class GetUseProfileDTO {
  @IsString()
  @ApiProperty()
  userId: string;
}
