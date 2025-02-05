import { Controller, Get, HttpException, UseGuards, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserTypes } from 'src/common/decorators/user-type.decorator';
import { USER_TYPE } from '../user/enum/user.enum';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { QueryLogDto } from './dto/query-log.dto';

@ApiTags('Log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Get()
  @UserTypes(USER_TYPE.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findAll(
    @Query() queryLogDto: QueryLogDto,
  ) {
    try {
      const data = await this.logService.findAll(queryLogDto);
      return {
        success: true,
        ...data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
