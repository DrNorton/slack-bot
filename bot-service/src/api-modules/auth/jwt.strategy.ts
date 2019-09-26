import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import InstalledUserDto from '../install/dto/installedUser.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.jwtConstant,
    });
  }

  async validate(data: any) {
    const payload: InstalledUserDto = {
      userId: data.userId,
      login: data.login,
      teamId: data.teamId,
    };
    return payload;
  }
}
