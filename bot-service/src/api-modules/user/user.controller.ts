import {
  Body,
  Controller,
  Get,
  Injectable,
  Res,
  UseGuards,
} from '@nestjs/common';
import BaseApiResponse from '../base/base.api.response';
import { ApiOperation } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators/user.decorator';
import InstalledUserDto from '../install/dto/installedUser.dto';
import UserService from '../user/user.service';
import UserDto from '../user/dto/user.dto';

@Injectable()
@Controller('user')
export default class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @ApiOperation({ title: 'Проверка токена и получение профиля' })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public async check(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<UserDto>> {
    const profile = await this.userService.getUser(user.userId);
    return this.successResponse(profile);
  }
}
