import * as fs from 'fs';
import * as path from 'path';


export function generateController(moduleDir: string, CapitalizedModule: string, moduleName: string) {
  const camelCaseModule = CapitalizedModule.charAt(0).toLowerCase() + CapitalizedModule.slice(1);

  const controllerContent = `
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Query } from '@nestjs/common';
import { ${CapitalizedModule}Service } from './${moduleName}.service';
import { Create${CapitalizedModule}Dto } from './dto/create-${moduleName}.dto';
import { Update${CapitalizedModule}Dto } from './dto/update-${moduleName}.dto';
import { Query${CapitalizedModule}Dto } from './dto/query-${moduleName}.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('${CapitalizedModule}')
@Controller('${moduleName}')
export class ${CapitalizedModule}Controller {
  constructor(private readonly ${camelCaseModule}Service: ${CapitalizedModule}Service) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: Create${CapitalizedModule}Dto) {
    try {
      const data = await this.${camelCaseModule}Service.create(createDto);
      return { success: true, data };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() queryDto: Query${CapitalizedModule}Dto) {
    try {
      return await this.${camelCaseModule}Service.findAll(queryDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.${camelCaseModule}Service.findOne(+id);
      return { success: true, data };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: Update${CapitalizedModule}Dto) {
    try {
      const data = await this.${camelCaseModule}Service.update(+id, updateDto);
      return { success: true, data };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      const data = await this.${camelCaseModule}Service.remove(+id);
      return { success: true, data };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
`;
  fs.writeFileSync(path.join(moduleDir, `${moduleName}.controller.ts`), controllerContent);
}