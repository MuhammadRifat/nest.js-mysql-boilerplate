import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Query } from '@nestjs/common';
import { EnumService } from './enum.service';
import { CreateEnumDto } from './dto/create-enum.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IPaginate } from 'src/common/dtos/dto.common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Enum')
@Controller('enum')
export class EnumController {
  constructor(private readonly enumService: EnumService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEnumDto: CreateEnumDto) {
    try{
      const data = await this.enumService.upsert(createEnumDto);
      return {
        success: true,
        data
      }
    } catch(error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() paginate: IPaginate,
  ) {
    try{
      const data = await this.enumService.findAll(paginate);
      return {
        success: true,
        ...data
      }
    } catch(error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('key') key: string) {
    try{
      const data = await this.enumService.findOne(key);
      return {
        success: true,
        data
      }
    } catch(error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try{
      const data = await this.enumService.remove(+id);
      return {
        success: true,
        data
      }
    } catch(error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
