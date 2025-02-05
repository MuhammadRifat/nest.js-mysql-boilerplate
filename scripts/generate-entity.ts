import * as fs from 'fs';
import * as path from 'path';


export function generateEntity(moduleDir: string, CapitalizedModule: string, moduleName: string) {
  const entityDir = path.join(moduleDir, 'entities');
  if (!fs.existsSync(entityDir)) {
    fs.mkdirSync(entityDir);
  }

  // Generate Entity
  const entityContent = `
 export class ${CapitalizedModule} {
     name: string;
 }
 `;
  fs.writeFileSync(path.join(entityDir, `${moduleName}.entity.ts`), entityContent);

}