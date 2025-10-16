import 'reflect-metadata';
//
import { env } from '@/config';
import { availableModules, devModeModules } from '@/config/deployment.config';
import { App } from '@/core/App';
import { Router } from 'express';
import path from 'path';

async function bootstrap() {
  console.log('Bootstrapping Development Monolith...');
  const activeModules: { prefix: string; router: Router }[] = [];

  for (const moduleName of devModeModules) {
    const moduleDef = availableModules[moduleName];
    if (moduleDef) {
      try {
        // --- BAGIAN YANG DIPERBAIKI ---
        // 1. Dapatkan sisa path setelah alias
        const modulePath = moduleDef.path.replace('@/', '');

        // 2. Buat path absolut relatif terhadap DIREKTORI FILE INI
        //    Ini akan bekerja baik di src/main.ts maupun di dist/main.js
        const absolutePath = path.resolve(__dirname, modulePath);

        // 3. Impor menggunakan path absolut yang sudah benar
        const module = await import(absolutePath);
        // --- AKHIR PERBAIKAN ---

        activeModules.push({
          prefix: `/api/v1/${moduleName}`,
          router: module.default,
        });
      } catch (e) {
        console.error(`❌ Failed to load module "${moduleName}"`, e);
      }
    }
  }

  const monolithApp = new App(env.PORT, activeModules);
  monolithApp.start();
}

bootstrap();
