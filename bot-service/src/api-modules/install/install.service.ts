import { Injectable } from '@nestjs/common';
import { TeamService } from '../team/team.service';
import CommonBotConnector from '../../botkit/common/common.bot.connector';
import TeamDto from '../team/dto/team.dto';
import AuthService from '../auth/auth.service';
import UserService from '../user/user.service';
import { MembersService } from '../members/members.service';
import { EmojiService } from '../emoji/emoji.service';

@Injectable()
export class InstallService {
  constructor(
    private readonly userService: UserService,
    private readonly connector: CommonBotConnector,
    private readonly authService: AuthService,
    private readonly membersService: MembersService,
  ) {}

  public async install(code: string): Promise<string> {
    const controller = this.connector.get();
    // we need to use the Slack API, so spawn a generic bot with no token
    const payload = await controller.adapter.validateOauthCode(code);
    const dto = new TeamDto();
    dto.access_token = payload.access_token;
    dto.team_id = payload.team_id;
    dto.scope = payload.scope;
    dto.user_id = payload.user_id;
    dto.team_name = payload.team_name;
    dto.bot_access_token = payload.bot.bot_access_token;
    dto.bot_user_id = payload.bot.bot_user_id;
    const userPayload = await this.userService.insertTeamAndUser(dto);
    await this.membersService.loadMembers(
      payload.access_token,
      payload.team_id,
    );

    const jwtToken = await this.authService.login(userPayload);
    return jwtToken;
  }
}
