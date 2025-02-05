import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { User } from './entities/user.entity';
import { MysqlService } from 'src/common/services/mysql-service.common';
import { IPaginate } from 'src/common/dtos/dto.common';
import { DB_TABLES } from 'src/common/enums/db.enum';
import * as bcrypt from 'bcryptjs';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService extends MysqlService<User> {

  constructor(
    @InjectConnection() private knex: Knex<any, User[]>,
  ) {
    super(knex, DB_TABLES.USER);
  }

  // create one
  async create(createUserDto: CreateUserDto, admin: User) {
    const [isExitUser] = await this.knex.table(DB_TABLES.USER)
      .where({ email: createUserDto.email });

    if (isExitUser) {
      throw new BadRequestException('user already exist.');
    }

    const user = await this.createOne(createUserDto);
    delete user?.password;

    // log
    this.logForCreate(admin.id, null, user);
    return user;
  }


  // find all by paginate
  async findAll(queryUserDto: QueryUserDto) {
    const { search, ...paginate } = queryUserDto;

    if (search) {
      return await this.searchLike(search, ['name', 'email']);
    }

    const data = await this.findWithPaginate(paginate);
    const users = data.data?.map(user => {
      const { password, ...userData } = user;
      return userData;
    })

    return {
      ...data,
      data: users
    }
  }

  // find one by id
  async findOne(id: number) {
    const data = await this.findOneById(id);

    if (!data) {
      throw new NotFoundException('user not found');
    }

    return data;
  }

  // update user by id
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!Object.keys(updateUserDto).length) {
      throw new BadRequestException('must have a property');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.generateHash(updateUserDto.password);
    }

    const user = await this.updateById(id, updateUserDto);
    if (!user) {
      throw new InternalServerErrorException('update failed');
    }

    delete user?.password;
    return user;
  }

  // delete user by id
  async remove(id: number) {
    const data = await this.removeById(id);

    if (!data) {
      throw new InternalServerErrorException('delete failed');
    }

    return data;
  }

  // generate hash
  private async generateHash(plainPassword: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(plainPassword, salt);
  }
}
