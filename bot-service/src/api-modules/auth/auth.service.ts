import { Injectable } from '@nestjs/common';
import InstalledUserDto from '../install/dto/installedUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public login(userPayload: InstalledUserDto) {
    return  this.jwtService.sign(userPayload);
  }
}
