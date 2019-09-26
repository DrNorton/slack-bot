import { Column } from 'typeorm';

export default class TeamDto {
  access_token: string;
  scope: string;
  user_id: string;
  team_id: string;
  team_name: string;
  bot_user_id: string;
  bot_access_token: string;
}
