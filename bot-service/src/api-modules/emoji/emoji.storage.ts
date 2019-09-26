import { Injectable } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import EmojiDto from './dto/emoji.dto';

@Injectable()
export default class EmojiStorage {
  private storage: Map<string, EmojiDto[]>;
  constructor(private readonly emojiService: EmojiService) {
    this.storage = new Map<string, EmojiDto[]>();
  }

  public async getEmoji(teamId: string): Promise<EmojiDto[]> {
    if (this.storage.has(teamId)) {
      return this.storage.get(teamId);
    } else {
      const teamEmoji = await this.emojiService.getEmoji(teamId);
      this.storage.set(teamId, teamEmoji);
      return teamEmoji;
    }
  }

  public async searchEmoji(teamId: string, emoji: string): Promise<EmojiDto> {
    const emojyList = await this.getEmoji(teamId);
    return emojyList.find(x => x.name === emoji);
  }
}
