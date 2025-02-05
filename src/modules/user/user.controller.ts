import { Controller, Get, Body, Patch, Param, Delete, Query, HttpException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginate } from 'src/common/dtos/dto.common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { UserTypes } from 'src/common/decorators/user-type.decorator';
import { USER_TYPE } from './enum/user.enum';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() queryUserDto: QueryUserDto,
    @GetUser() user: User
  ) {
    try {
      const data = await this.userService.findAll(queryUserDto);

      return {
        success: true,
        ...data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.userService.findOne(+id);
      delete data.password;

      return {
        success: true,
        data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  @UserTypes(USER_TYPE.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const data = await this.userService.update(+id, updateUserDto);

      return {
        success: true,
        data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UserTypes(USER_TYPE.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async remove(@Param('id') id: string) {
    try {
      const data = await this.userService.remove(+id);

      return {
        success: true,
        data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
