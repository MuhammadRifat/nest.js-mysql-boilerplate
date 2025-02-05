import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnumDto } from './dto/create-enum.dto';
import { UpdateEnumDto } from './dto/update-enum.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { MysqlService } from 'src/common/services/mysql-service.common';
import { IPaginate } from 'src/common/dtos/dto.common';
import { DB_TABLES } from 'src/common/enums/db.enum';
import { Enum } from './entities/enum.entity';

@Injectable()
export class EnumService extends MysqlService<Enum> {
  private select = ['id', 'key', 'value'];

  constructor(
    @InjectConnection() private knex: Knex<any, Enum[]>,
  ) {
    super(knex, DB_TABLES.ENUM);
  }

  // create one
  async upsert(createEnumDto: CreateEnumDto) {
    const isExitEnum = await this.findOneByQuery({key: createEnumDto.key});

    if (isExitEnum) {
      await this.knex.table(DB_TABLES.ENUM).update('value', createEnumDto.value).where('id', isExitEnum.id);
      return this.findOneById(isExitEnum.id);
    }

    return await this.createOne(createEnumDto);
  }


  // find all by paginate
  async findAll(paginate: IPaginate) {
    return await this.findWithPaginate(paginate, {}, this.select);
  }

  // find one by id
  async findOne(key: string) {
    const data = await this.findOneByQuery({key: key}, this.select);

    if (!data) {
      throw new NotFoundException('enum not found');
    }

    return data;
  }

  // update enum by id
  async update(id: number, updateEnumDto: UpdateEnumDto) {
    if (!Object.keys(updateEnumDto).length) {
      throw new BadRequestException('must have a property');
    }

    const data = await this.updateById(id, updateEnumDto);
    if (!data) {
      throw new InternalServerErrorException('update failed');
    }
    
    return data;
  }

  // delete enum by id
  async remove(id: number) {
    const data = await this.removeById(id);

    if (!data) {
      throw new InternalServerErrorException('delete failed');
    }

    return data;
  }
}
