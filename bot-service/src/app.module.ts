import { Module } from '@nestjs/common';
import { BotkitModule } from './botkit/botkit.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api-modules/api.module';
import { AnswerEntity } from './api-modules/faq/entity/answer.entity';
import { QuestionEntity } from './api-modules/faq/entity/question.entity';
import { TeamEntity } from './api-modules/team/entity/team.entity';
import { UserEntity } from './api-modules/user/entity/user.entity';
import { MemberEntity } from './api-modules/members/entity/member.entity';
import { EmojiEntity } from './api-modules/emoji/entity/emoji.entity';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [
        AnswerEntity,
        QuestionEntity,
        TeamEntity,
        UserEntity,
        MemberEntity,
        EmojiEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    BotkitModule,
    ApiModule,
    InternalModule,
  ],
})
export class AppModule {}
