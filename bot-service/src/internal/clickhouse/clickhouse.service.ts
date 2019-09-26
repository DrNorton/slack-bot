import { Injectable } from '@nestjs/common';
import { ClickHouse, WriteStream } from 'clickhouse';
import PresentPointDto from './dto/presentPoint.dto';
import * as clickhouse from 'clickhouse';
import * as stream from 'stream';
import getISO, {
  getCurrentMonthNumber,
  getCurrentWeekNumber,
  getCurrentYearNumber,
} from '../../utils/dateUtils';
import ScoresByUserIdDto from './dto/scoresByUserId.dto';

@Injectable()
export default class ClickhouseService {
  private createClickhouseClient(): ClickHouse {
    const clickhouse = new ClickHouse({
      url: 'http://localhost',
      port: 8123,
      debug: false,
      basicAuth: null,
      isUseGzip: false,
      config: {
        session_timeout: 60,
        output_format_json_quote_64bit_integers: 0,
        enable_http_compression: 0,
      },
    });
    return clickhouse;
  }
  public async onModuleInit() {
    await this.createTableIfNotExists();
  }
  public async createTableIfNotExists() {
    const query =
      'CREATE TABLE IF NOT EXISTS score ( date Date, teamId String, toId String, fromId String, score UInt32, emoji String ) ENGINE = MergeTree(date,toId, 8192)';

    const r = await this.createClickhouseClient()
      .query(query)
      .toPromise();

    console.log(query, r);
  }

  public async getWinnerForCurrentWeek(teamId: string) {
    const query = `SELECT sum(score),toId  from score Where toWeek(date,3)=${getCurrentWeekNumber()} AND teamId='${teamId}' Group BY toId ORDER BY sum(score) DESC`;
    return await this.executeSelectWinners(query);
  }

  public async getWinnerForCurrentMonth(teamId: string) {
    const query = `SELECT sum(score),toId from score Where toMonth(date)=${getCurrentMonthNumber()} AND teamId='${teamId}' Group BY toId ORDER BY sum(score) DESC`;
    return await this.executeSelectWinners(query);
  }

  public async getWinnerForCurrentYear(teamId: string) {
    const query = `SELECT sum(score),toId from score Where toYear(date)=${getCurrentYearNumber()} AND teamId='${teamId}' Group BY toId ORDER BY sum(score) DESC`;
    return await this.executeSelectWinners(query);
  }

  private async executeSelectWinners(query: string) {
    const queryResult = await this.createClickhouseClient()
      .query(query)
      .toPromise();

    return queryResult.map((res: any) => {
      const scoreByUser = new ScoresByUserIdDto();
      scoreByUser.score = res['sum(score)'];
      scoreByUser.ownerUserId = res.toId;
      return scoreByUser;
    });
  }

  public async insertPoint(teamId: string, presentData: PresentPointDto) {
    const date = new Date();
    const insertedItem = {
      date: getISO(date),
      teamId,
      toId: presentData.toId,
      fromId: presentData.fromId,
      score: presentData.score,
      emoji: presentData.emoji,
    };
    const r2 = await this.createClickhouseClient()
      .insert('INSERT INTO score (date, teamId, toId, fromId, score, emoji)', [
        insertedItem,
      ])
      .toPromise();
  }
}
