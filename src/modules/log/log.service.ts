import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { MysqlService } from 'src/common/services/mysql-service.common';
import { DB_TABLES } from 'src/common/enums/db.enum';
import { Log } from './entities/log.entity';
import { QueryLogDto } from './dto/query-log.dto';

@Injectable()
export class LogService extends MysqlService<Log> {

  constructor(
    @InjectConnection() private knex: Knex<any, Log[]>,
  ) {
    super(knex, DB_TABLES.LOG);
  }

  // find all by paginate
  async findAll(queryLogDto: QueryLogDto) {
    const { page, limit, ...restQuery } = queryLogDto;

    return await this.findWithPaginate({ page, limit }, restQuery);
  }
}
