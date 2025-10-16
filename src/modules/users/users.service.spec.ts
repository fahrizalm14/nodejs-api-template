import 'reflect-metadata';
import { container } from 'tsyringe';
import { UsersService } from '@/modules/users/users.service';
import { UsersRepository } from '@/modules/users/users.repository';
import { IUsers } from '@/modules/users/users.interface';

// 1. Buat mock untuk dependensi (Repository)
const mockUsersRepository = {
  findAll: jest.fn(),
};

// 2. Deskripsikan test suite Anda
describe('UsersService', () => {
  let service: UsersService;

  // 3. Atur ulang dan daftarkan mock sebelum setiap tes
  beforeEach(() => {
    jest.clearAllMocks();
    container.register<UsersRepository>(UsersRepository, {
      useValue: mockUsersRepository,
    });
    service = container.resolve(UsersService);
  });

  // 4. Tulis test case pertama Anda
  it('should call findAll on the repository when fetching all items', async () => {
    // Arrange: Siapkan data palsu dan perilaku mock
    const mockData: IUsers[] = [{ id: 1, name: 'Test Item' }];
    mockUsersRepository.findAll.mockResolvedValue(mockData);

    // Act: Jalankan fungsi yang diuji
    const result = await service.findAll();

    // Assert: Pastikan hasilnya sesuai harapan
    expect(result).toEqual(mockData);
    expect(mockUsersRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
