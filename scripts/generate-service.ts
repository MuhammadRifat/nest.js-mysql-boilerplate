import * as fs from 'fs';
import * as path from 'path';


export function generateService(moduleDir: string, CapitalizedModule: string, moduleName: string) {
  const serviceTemplate = `
   import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
   import { Create${CapitalizedModule}Dto } from './dto/create-${moduleName}.dto';
   import { Update${CapitalizedModule}Dto } from './dto/update-${moduleName}.dto';
   import { InjectConnection } from 'nest-knexjs';
   import { Knex } from 'knex';
   import { MysqlService } from 'src/common/services/mysql-service.common';
   import { DB_TABLES } from 'src/common/enums/db.enum';
   import { ${CapitalizedModule} } from './entities/${moduleName}.entity';
   import { Query${CapitalizedModule}Dto } from './dto/query-${moduleName}.dto';
   
   @Injectable()
   export class ${CapitalizedModule}Service extends MysqlService<${CapitalizedModule}> {
   
     constructor(
       @InjectConnection() private knex: Knex<any, ${CapitalizedModule}[]>,
     ) {
       super(knex, DB_TABLES.${CapitalizedModule.toUpperCase()});
     }
   
     async create(createDto: Create${CapitalizedModule}Dto) {
       return await this.createOne(createDto);
     }
   
     async findAll(queryDto: Query${CapitalizedModule}Dto) {
       const { search, page, limit, ...restQuery } = queryDto;
       if (search) {
         return await this.searchLike(search, ['name']);
       }
       return await this.findWithPaginate({page, limit}, restQuery);
     }
   
     async findOne(id: number) {
       const data = await this.findOneById(id);
       if (!data) {
         throw new NotFoundException('${moduleName} not found');
       }
       return data;
     }
   
     async update(id: number, updateDto: Update${CapitalizedModule}Dto) {
       if (!Object.keys(updateDto).length) {
         throw new BadRequestException('must have a property');
       }
       const updated = await this.updateById(id, updateDto);
       if (!updated) {
         throw new InternalServerErrorException('update failed');
       }
       return updated;
     }
   
     async remove(id: number) {
       const data = await this.removeById(id);
       if (!data) {
         throw new InternalServerErrorException('delete failed');
       }
       return data;
     }
   }
   `;

  fs.writeFileSync(path.join(moduleDir, `${moduleName}.service.ts`), serviceTemplate);

}