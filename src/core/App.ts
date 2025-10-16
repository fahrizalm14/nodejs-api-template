import { errorHandler } from '@/core/middleware/errorHandler';
import { Logger } from '@/shared/utils/logger';
import express, { Express, Router } from 'express';
import { container } from 'tsyringe';

export class App {
  public readonly expressApp: Express;
  private readonly logger: Logger;

  constructor(
    private readonly port: number,
    private readonly modules: { prefix: string; router: Router }[],
  ) {
    this.logger = container.resolve(Logger);
    this.expressApp = express();
    this.expressApp.use(express.json());
    this.setupRoutes();
    this.expressApp.use(errorHandler);
  }

  private setupRoutes(): void {
    this.expressApp.get('/health', (_req, res) => res.status(200).send(`OK`));
    for (const mod of this.modules) {
      this.expressApp.use(mod.prefix, mod.router);
      this.logger.info(`✅ Module loaded at prefix: ${mod.prefix}`);
    }
  }

  public start(): void {
    const server = this.expressApp.listen(this.port, () => {
      this.logger.info(`🚀 App listening on http://localhost:${this.port}`);
    });

    // --- TAMBAHKAN BLOK KODE INI ---
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // Menangani error spesifik saat server gagal berjalan
      switch (error.code) {
        case 'EACCES': // Error karena hak akses
          this.logger.error(
            `❌ Port ${this.port} memerlukan hak akses administrator.`,
            error,
          );
          process.exit(1);
        case 'EADDRINUSE': // Error karena port sudah digunakan
          this.logger.error(
            `❌ Port ${this.port} sudah digunakan oleh aplikasi lain.`,
            error,
          );
          process.exit(1);
        default:
          throw error;
      }
    });
    // --- AKHIR BLOK KODE ---
  }
}
