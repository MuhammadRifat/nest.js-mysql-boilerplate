import * as fs from 'fs';
import * as path from 'path';


export function addDBName(moduleDir: string, CapitalizedModule: string, moduleName: string) {
  const dbEnumPath = path.join(__dirname, '..', 'src', 'common', 'enums', 'db.enum.ts');
  let dbEnumContent = fs.readFileSync(dbEnumPath, 'utf-8');

  if (!dbEnumContent.includes(` ${CapitalizedModule.toUpperCase()} =`)) {
    // Insert new enum value before the last closing bracket
    const insertIndex = dbEnumContent.lastIndexOf('}');
    dbEnumContent =
      dbEnumContent.slice(0, insertIndex) +
      `\t${CapitalizedModule.toUpperCase()} = '${CapitalizedModule.toLowerCase()}',\n` +
      dbEnumContent.slice(insertIndex);

    // Write back the updated file
    fs.writeFileSync(dbEnumPath, dbEnumContent, 'utf-8');
  }
}