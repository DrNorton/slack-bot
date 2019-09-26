import { Injectable } from '@nestjs/common';
import CommonBotConnector from '../../common/common.bot.connector';
import ClickhouseService from '../../../internal/clickhouse/clickhouse.service';
import PresentPointDto from '../../../internal/clickhouse/dto/presentPoint.dto';
import EmojiStorage from '../../../api-modules/emoji/emoji.storage';

@Injectable()
export default class ReactionDialog {
  constructor(
    private readonly connector: CommonBotConnector,
    private readonly clickhouseService: ClickhouseService,
    private readonly emojiStorage: EmojiStorage,
  ) {}

  public onModuleInit() {
    const controller = this.connector.get();
    controller.on('reaction_added', async (bot, message) => {
      const team = message.team;
      const presentDto = new PresentPointDto();
      presentDto.fromId = message.user;
      presentDto.toId = message.item_user;
      console.log(`TAKE REACTION ${message.reaction}`);
      const findedEmoji = await this.emojiStorage.searchEmoji(
        team,
        message.reaction,
      );
      if (findedEmoji) {
        presentDto.emoji = findedEmoji.name;
        presentDto.score = findedEmoji.scorePoints;
        console.log('SEND REACTION TO CLICKHOUSE');
        await this.clickhouseService.insertPoint(team, presentDto);
      }
    });
  }
}
