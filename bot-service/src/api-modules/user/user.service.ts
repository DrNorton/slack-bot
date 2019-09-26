import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import UserDto from './dto/user.dto';
import TeamDto from '../team/dto/team.dto';
import InstalledUserDto from '../install/dto/installedUser.dto';
import { TeamEntity } from '../team/entity/team.entity';
import SlackApiService from '../../internal/slack-api/slack.api.service';
import { EmojiService } from '../emoji/emoji.service';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly slackApiService: SlackApiService,
    private readonly emojiService: EmojiService,
  ) {}

  public findUserEntity(userId: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id: userId });
  }

  public findUserAndTeamEntity(userId: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id: userId }, { relations: ['team'] });
  }

  public async getUser(userId: string): Promise<UserDto> {
    const userEntity = await this.findUserAndTeamEntity(userId);
    return this.convertEntityToDto(userEntity);
  }

  public async insertTeamAndUser(dto: TeamDto): Promise<InstalledUserDto> {
    let user: UserEntity;
    const findedUser = await this.findUserEntity(dto.user_id);
    if (findedUser) {
      user = findedUser;
    } else {
      const result = await this.slackApiService.getUserInfo(
        dto.access_token,
        dto.user_id,
      );
      user = new UserEntity();
      user.id = result.id;
      user.name = result.name;
      user.realName = result.real_name;
      user.avatarUrl = result.profile.image_original;
      user.isAdmin = result.is_admin;
    }

    let createdOrUpdatedTeam: TeamEntity;
    const findedTeam = await this.teamRepository.findOne({
      id: dto.team_id,
    });
    if (findedTeam) {
      createdOrUpdatedTeam = findedTeam;
    } else {
      createdOrUpdatedTeam = new TeamEntity();
      createdOrUpdatedTeam.emojiis = this.emojiService.getPredifinedEmojies(createdOrUpdatedTeam);
    }

    createdOrUpdatedTeam.access_token = dto.access_token;
    createdOrUpdatedTeam.scope = dto.scope;
    createdOrUpdatedTeam.id = dto.team_id;
    createdOrUpdatedTeam.bot_access_token = dto.bot_access_token;
    createdOrUpdatedTeam.bot_user_id = dto.bot_access_token;
    createdOrUpdatedTeam.team_name = dto.team_name;
    user.team = createdOrUpdatedTeam;
    const test = await this.userRepository.save(user);
    return {
      userId: user.id,
      login: user.name,
      teamId: createdOrUpdatedTeam.id,
    };
  }

  private convertEntityToDto(entity: UserEntity): UserDto {
    const userDto = new UserDto();
    userDto.avatarUrl = entity.avatarUrl;
    userDto.id = entity.id;
    userDto.name = entity.name;
    if (entity.team) {
      userDto.teamName = entity.team.team_name;
    }
    userDto.realName = entity.realName;
    userDto.isAdmin = entity.isAdmin;
    return userDto;
  }
}
