import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export default class SlackApiService {
  public async getUserInfo(token: string, userId: string): Promise<any> {
    const web = new WebClient(token);
    const result = await web.users.info({ token, user: userId });
    if (result.ok) {
      return result.user;
    } else {
      throw new Error(result.error);
    }
  }

  public async getUsersList(token: string): Promise<any> {
    const web = new WebClient(token);
    const result = await web.users.list({ token });
    if (result.ok) {
      return result.members;
    } else {
      throw new Error(result.error);
    }
  }

  public async getEmojiis(token: string): Promise<any> {
    const web = new WebClient(token);
    const result = await web.emoji.list({ token });
    if (result.ok) {
      return result.emoji;
    } else {
      throw new Error(result.error);
    }
  }
}
