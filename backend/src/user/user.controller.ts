import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@/shared/decorators';
import { GetUseProfileDTO } from './dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Public()
  @Get()
  async getPublicProfile(@Param() { userId }: GetUseProfileDTO) {
    return this.userService.getPublicProfile(userId);
  }
}
