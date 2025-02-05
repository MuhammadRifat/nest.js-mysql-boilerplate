import * as fs from 'fs';
import * as path from 'path';


export function generateDto(moduleDir: string, CapitalizedModule: string, moduleName: string) {
  const dtoDir = path.join(moduleDir, 'dto');
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir);
  }

  // Generate Create Dto
  const createDtoContent = `
 import { IsNotEmpty, IsString } from 'class-validator';
 
 export class Create${CapitalizedModule}Dto {
     @IsNotEmpty()
     @IsString()
     name: string;
 }
 `;
  fs.writeFileSync(path.join(dtoDir, `create-${moduleName}.dto.ts`), createDtoContent);

  // Generate Update Dto
  const updateDtoContent = `
 import { PartialType } from '@nestjs/mapped-types';
 import { Create${CapitalizedModule}Dto } from './create-${moduleName}.dto';
 
 export class Update${CapitalizedModule}Dto extends PartialType(Create${CapitalizedModule}Dto) {}
 `;
  fs.writeFileSync(path.join(dtoDir, `update-${moduleName}.dto.ts`), updateDtoContent);


  // Generate Query Dto
  const queryDtoContent = `
 import { IsOptional, IsString } from "class-validator";
 import { IPaginate } from "src/common/dtos/dto.common";
 
 export class Query${CapitalizedModule}Dto extends IPaginate {
   @IsOptional()
   @IsString()
   search?: string;
 }
 `;
  fs.writeFileSync(path.join(dtoDir, `query-${moduleName}.dto.ts`), queryDtoContent);

}