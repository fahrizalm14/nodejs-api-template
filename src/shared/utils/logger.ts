import { env } from '@/config';
import pino from 'pino';
import { singleton } from 'tsyringe';

@singleton()
export class Logger {
  private readonly pino: pino.Logger;

  constructor() {
    this.pino = pino({
      // Gunakan pino-pretty untuk log yang lebih mudah dibaca saat development
      transport:
        env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    });
  }

  /**
   * Mencatat log untuk informasi umum.
   * @param message Pesan log
   */
  info(message: string) {
    this.pino.info(message);
  }

  /**
   * Mencatat log untuk error.
   * @param message Pesan error kustom
   * @param error Objek Error yang asli
   */
  error(message: string, error: Error) {
    // Kita sertakan objek error asli untuk mendapatkan stack trace
    this.pino.error({ err: error }, message);
  }
}
