import { createParamDecorator } from '@nestjs/common';
import InstalledUserDto from '../api-modules/install/dto/installedUser.dto';

export const User = createParamDecorator(
  (data, req): InstalledUserDto => {
    return req.user;
  },
);
