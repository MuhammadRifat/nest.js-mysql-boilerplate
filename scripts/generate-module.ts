import * as fs from 'fs';
import * as path from 'path';


export function generateModule(moduleDir: string, CapitalizedModule: string, moduleName: string) {

    const moduleContent = `
import { Module } from '@nestjs/common';
import { ${CapitalizedModule}Service } from './${moduleName}.service';
import { ${CapitalizedModule}Controller } from './${moduleName}.controller';

@Module({
  controllers: [${CapitalizedModule}Controller],
  providers: [${CapitalizedModule}Service],
})
export class ${CapitalizedModule}Module {}
`;
    fs.writeFileSync(path.join(moduleDir, `${moduleName}.module.ts`), moduleContent);
}