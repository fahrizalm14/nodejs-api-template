import fs from 'fs/promises';
import inquirer from 'inquirer';
import path from 'path';

// Fungsi helper dan template tetap sama
const toPascalCase = (s: string) =>
  s.replace(/(^\w|-\w)/g, (g) => g.replace('-', '').toUpperCase());
const toCamelCase = (s: string) => {
  const pascal = toPascalCase(s);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const templates = {
  routes: (
    name: string,
    pascal: string,
    camel: string,
  ) => `import { Router } from 'express';
import { container } from 'tsyringe';
import { ${pascal}Controller } from '@/modules/${name}/${name}.controller';
import { asyncHandler } from '@/core/middleware/asyncHandler';
const ${camel}Router = Router();
const controller = container.resolve(${pascal}Controller);
${camel}Router.get('/', asyncHandler(controller.get.bind(controller)));
export default ${camel}Router;`,
  controller: (
    name: string,
    pascal: string,
  ) => `import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ${pascal}Service } from '@/modules/${name}/${name}.service';
@injectable()
export class ${pascal}Controller {
  constructor(@inject(${pascal}Service) private readonly service: ${pascal}Service) {}
  async get(_req: Request, res: Response) {
    const data = await this.service.findAll();
    res.status(200).json({ status: 'success', data });
  }
}`,
  service: (
    name: string,
    pascal: string,
  ) => `import { injectable, inject } from 'tsyringe';
import { ${pascal}Repository } from '@/modules/${name}/${name}.repository';
@injectable()
export class ${pascal}Service {
  constructor(@inject(${pascal}Repository) private readonly repo: ${pascal}Repository) {}
  async findAll() { return this.repo.findAll(); }
}`,
  repository: (
    name: string,
    pascal: string,
  ) => `import { singleton } from 'tsyringe';
import { I${pascal} } from '@/modules/${name}/${name}.interface';
@singleton()
export class ${pascal}Repository {
  async findAll(): Promise<I${pascal}[]> {
    return [{ id: 1, name: 'Sample ${pascal}' }];
  }
}`,
  interface: (pascal: string) =>
    `export interface I${pascal} { id: number; name: string; }`,
  // --- TAMBAHKAN TEMPLATE BARU INI ---
  'service.spec': (name: string, pascal: string) => `import 'reflect-metadata';
import { container } from 'tsyringe';
import { ${pascal}Service } from '@/modules/${name}/${name}.service';
import { ${pascal}Repository } from '@/modules/${name}/${name}.repository';
import { I${pascal} } from '@/modules/${name}/${name}.interface';

// 1. Buat mock untuk dependensi (Repository)
const mock${pascal}Repository = {
  findAll: jest.fn(),
};

// 2. Deskripsikan test suite Anda
describe('${pascal}Service', () => {
  let service: ${pascal}Service;

  // 3. Atur ulang dan daftarkan mock sebelum setiap tes
  beforeEach(() => {
    jest.clearAllMocks();
    container.register<${pascal}Repository>(${pascal}Repository, {
      useValue: mock${pascal}Repository,
    });
    service = container.resolve(${pascal}Service);
  });

  // 4. Tulis test case pertama Anda
  it('should call findAll on the repository when fetching all items', async () => {
    // Arrange: Siapkan data palsu dan perilaku mock
    const mockData: I${pascal}[] = [{ id: 1, name: 'Test Item' }];
    mock${pascal}Repository.findAll.mockResolvedValue(mockData);

    // Act: Jalankan fungsi yang diuji
    const result = await service.findAll();

    // Assert: Pastikan hasilnya sesuai harapan
    expect(result).toEqual(mockData);
    expect(mock${pascal}Repository.findAll).toHaveBeenCalledTimes(1);
  });
});
`,
};

// Fungsi utama skrip
async function createModule() {
  const { moduleName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Enter new module name (e.g., products):',
      validate: (input) =>
        /^[a-z]+(-[a-z]+)*$/.test(input) ||
        'Please use lowercase letters and single hyphens only.',
    },
  ]);

  const name = moduleName.toLowerCase();
  const pascalName = toPascalCase(name);
  const camelName = toCamelCase(name);
  const moduleDir = path.join(process.cwd(), 'src', 'modules', name);

  console.log(`\nCreating module "${name}"...`);
  await fs.mkdir(moduleDir, { recursive: true });

  for (const [fileType, templateFn] of Object.entries(templates)) {
    const fileName = `${name}.${fileType}.ts`;
    const content = templateFn(name, pascalName, camelName);
    await fs.writeFile(path.join(moduleDir, fileName), content);
    console.log(` ✓ Created ${fileName}`);
  }

  console.log(`\n🎉 Module "${pascalName}" created successfully!`);
  console.log(
    "\nIMPORTANT: Don't forget to manually update 'src/config/deployment.config.ts':",
  );
  console.log(`1. Add '${name}' to 'availableModules'.`);
  console.log(`2. Add '${name}' to 'devModeModules' to run it in development.`);
}

createModule();
