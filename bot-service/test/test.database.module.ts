import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { AnswerEntity } from '../src/api-modules/faq/entity/answer.entity';
import { QuestionEntity } from '../src/api-modules/faq/entity/question.entity';
import { TeamEntity } from '../src/api-modules/team/entity/team.entity';
import { UserEntity } from '../src/api-modules/user/entity/user.entity';
import { MemberEntity } from '../src/api-modules/members/entity/member.entity';
import { EmojiEntity } from '../src/api-modules/emoji/entity/emoji.entity';
import { RoomEntity } from '../src/api-modules/booking/meetingRooms/rooms/entity/room.entity';
import { RoomAttributeEntity } from '../src/api-modules/booking/meetingRooms/attributes/entity/roomAttribute.entity';
import { RoomAttributeTypeEntity } from '../src/api-modules/booking/meetingRooms/attributeTypes/entity/room.attributeType.entity';
import { config } from 'dotenv';
import { TestUtils } from './test.utils';
config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE_TEST,
      entities: [
        AnswerEntity,
        QuestionEntity,
        TeamEntity,
        UserEntity,
        MemberEntity,
        EmojiEntity,
        RoomEntity,
        RoomAttributeEntity,
        RoomAttributeTypeEntity,
      ],
      synchronize: true,
      logging: false,
    }),
  ],
  providers: [DatabaseService, TestUtils],
  exports: [DatabaseService, TestUtils],
})
export class TestDatabaseModule {}
