import * as fs from 'fs';
import * as path from 'path';
import { generateModule } from './generate-module';
import { generateController } from './generate-controller';
import { generateService } from './generate-service';
import { generateEntity } from './generate-entity';
import { generateDto } from './generate-dto';
import { addDBName } from './add-db-name';

const moduleName = process.argv[2]; // Take module name as input
if (!moduleName) {
  console.error('Please provide a module name');
  process.exit(1);
}

const CapitalizedModule = moduleName.replace(/[^a-zA-Z0-9 _-]/g, '').split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("");
const moduleDir = path.join(__dirname, '..', 'src', 'modules', moduleName);

if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir);
}
// 🟢 Generate Module File
generateModule(moduleDir, CapitalizedModule, moduleName);

// 🟢 Generate Controller File
generateController(moduleDir, CapitalizedModule, moduleName);

// 🟢 Generate Service
generateService(moduleDir, CapitalizedModule, moduleName);

// 🟢 Generate Entities Dir
generateEntity(moduleDir, CapitalizedModule, moduleName);

// 🟢 Generate DTOs Dir
generateDto(moduleDir, CapitalizedModule, moduleName);

// 🟢 Add new table name in db table
// addDBName(moduleDir, CapitalizedModule, moduleName);


console.log(`${CapitalizedModule} module created successfully!`);
