import { injectable, inject } from 'tsyringe';
import { UsersRepository } from '@/modules/users/users.repository';
@injectable()
export class UsersService {
  constructor(@inject(UsersRepository) private readonly repo: UsersRepository) {}
  async findAll() { return this.repo.findAll(); }
}