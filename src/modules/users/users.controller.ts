import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { UsersService } from '@/modules/users/users.service';
@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly service: UsersService) {}
  async get(_req: Request, res: Response) {
    const data = await this.service.findAll();
    res.status(200).json({ status: 'success', data });
  }
}