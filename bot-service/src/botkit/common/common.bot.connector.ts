import { Botkit } from 'botkit';
import { Injectable, Scope } from '@nestjs/common';
import {
  SlackAdapter,
  SlackEventMiddleware,
  SlackMessageTypeMiddleware,
} from 'botbuilder-adapter-slack';
import { TeamService } from '../../api-modules/team/team.service';

@Injectable()
export default class CommonBotConnector {
  private botkit: Botkit;

  constructor(private readonly teamService: TeamService) {}

  public init(server: any) {
    const adapter = new SlackAdapter({
      // parameters used to secure webhook endpoint
      verificationToken: process.env.verificationToken,
      clientSigningSecret: process.env.clientSigningSecret,

      // auth token for a single-team app
      botToken: process.env.botToken,

      // credentials used to set up oauth for multi-team apps
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      scopes: [
        'bot',
        'chat:write:user',
        'users:read',
        'team:read',
        'emoji:read',
      ],
      redirectUri: process.env.redirectUri,
      getTokenForTeam: this.getTokenForTeam,
      getBotUserByTeam: this.getBotUserByTeam,
    });

    // Use SlackEventMiddleware to emit events that match their original Slack event types.
    adapter.use(new SlackEventMiddleware());

    // Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
    adapter.use(new SlackMessageTypeMiddleware());

    this.botkit = new Botkit({
      adapter,
      webserver: server,
      webserver_middlewares: [],
      webhook_uri: '/api/messages',
    });
  }

  private getTokenForTeam = (teamId: string) => {
    return this.teamService.getTokenForTeam(teamId);
  };
  private getBotUserByTeam = (teamId: string) => {
    return this.teamService.getBotUserByTeam(teamId);
  };

  public get(): Botkit {
    return this.botkit;
  }
}
