import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Membungkus sebuah fungsi handler asynchronous.
 * Jika handler tersebut menghasilkan error (rejects a promise),
 * error akan ditangkap dan diteruskan ke middleware error handler utama Express.
 *
 * @param fn Fungsi handler asynchronous yang akan dibungkus.
 * @returns Sebuah fungsi handler Express yang baru.
 */
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
