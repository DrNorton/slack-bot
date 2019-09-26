import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '../team/entity/team.entity';
import { TeamService } from '../team/team.service';
import { InternalModule } from '../../internal/internal.module';
import ScoreService from './score.service';
import ScoreController from './score.controller';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [InternalModule, MembersModule],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
