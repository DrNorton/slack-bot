import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmojiEntity } from './entity/emoji.entity';
import { Repository } from 'typeorm';
import SlackApiService from '../../internal/slack-api/slack.api.service';
import { TeamEntity } from '../team/entity/team.entity';
import EmojiDto from './dto/emoji.dto';

@Injectable()
export class EmojiService {
  constructor(
    @InjectRepository(EmojiEntity)
    private readonly emojiRepository: Repository<EmojiEntity>,
  ) {}

  public async getEmoji(teamId: string) {
    const findedItems = await this.emojiRepository.find({
      team: { id: teamId },
    });
    return this.convertEntitiesToDto(findedItems);
  }

  public async addEmoji(teamId: string, emoji: EmojiDto) {
    const newEmoji = new EmojiEntity();
    newEmoji.teamId = teamId;
    newEmoji.url = emoji.url;
    newEmoji.scorePoints = emoji.scorePoints;
    newEmoji.name = emoji.name;
    newEmoji.isCustom = false;
    const addedItem = await this.emojiRepository.save(newEmoji);
    return this.convertEntityToDto(addedItem);
  }

  public async updateEmojiList(teamId: string, emoji: EmojiDto[]) {
    const entities = emoji.map(dto => this.convertDtoToEntity(dto, teamId));
    const updatedItems = await this.emojiRepository.save(entities);
    return updatedItems.map(entity => this.convertEntityToDto(entity));
  }

  public async deleteEmoji(teamId: string, emoji: string) {
    const deleteResult = await this.emojiRepository.delete({
      teamId,
      name: emoji,
    });
    return true;
  }

  private convertEntitiesToDto(entities: EmojiEntity[]) {
    return entities.map(entity => this.convertEntityToDto(entity));
  }

  private convertEntityToDto(entity: EmojiEntity) {
    const emojiDto = new EmojiDto();
    emojiDto.isCustom = entity.isCustom;
    emojiDto.name = entity.name;
    emojiDto.scorePoints = entity.scorePoints;
    emojiDto.url = entity.url;
    return emojiDto;
  }

  private convertDtoToEntity(dto: EmojiDto, teamId: string) {
    const emojiEntity = new EmojiEntity();
    emojiEntity.name = dto.name;
    emojiEntity.scorePoints = dto.scorePoints;
    emojiEntity.url = dto.url;
    emojiEntity.isCustom = dto.isCustom;
    emojiEntity.teamId = teamId;
    return emojiEntity;
  }

  public getPredifinedEmojies(teamEntity: TeamEntity) {
    const predifined: Array<{
      name: string;
      url: string;
      predifinedPoints: number;
    }> = [
      { name: '100', url: ':100:', predifinedPoints: 100 },
      { name: 'thumbsup', url: ':thumbsup:', predifinedPoints: 90 },
      { name: 'boom', url: ':boom:', predifinedPoints: 80 },
      { name: 'smiley', url: ':smiley:', predifinedPoints: 50 },
    ];
    return predifined.map(x => {
      const emoji = new EmojiEntity();
      emoji.name = x.name;
      emoji.team = teamEntity;
      emoji.scorePoints = x.predifinedPoints;
      emoji.isCustom = false;
      emoji.url = x.url;
      return emoji;
    });
  }
}
