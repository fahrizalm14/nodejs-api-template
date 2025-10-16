import { Logger } from '@/shared/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

/**
 * Kelas error kustom untuk error yang kita prediksi akan terjadi (misal: data tidak ditemukan).
 * Ini memungkinkan kita mengirim status code HTTP yang spesifik.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Middleware Express untuk menangani semua error.
 * WAJIB ditempatkan setelah semua rute di file Server/App.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction, // next harus ada agar Express mengenalinya sebagai error handler
) => {
  const logger = container.resolve(Logger);

  // Jika error adalah instance dari AppError yang kita buat,
  // gunakan status code dan message dari error tersebut.
  if (err instanceof AppError) {
    logger.error(`[API Error] ${err.statusCode} - ${err.message}`, err);
    return res
      .status(err.statusCode)
      .json({ status: 'fail', message: err.message });
  }

  // Untuk semua error lain yang tidak terduga, anggap sebagai 500 Internal Server Error.
  logger.error('An unexpected error occurred', err);
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected internal server error occurred.',
  });
};
