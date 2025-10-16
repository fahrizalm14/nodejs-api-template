import { singleton } from 'tsyringe';
import { IUsers } from '@/modules/users/users.interface';
@singleton()
export class UsersRepository {
  async findAll(): Promise<IUsers[]> {
    return [{ id: 1, name: 'Sample Users' }];
  }
}