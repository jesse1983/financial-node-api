import { AccountInput } from '../entities';
import { IAccountRepository } from '../interfaces';

export class AccountUseCase {
  iAccountRepository: IAccountRepository;

  constructor(iAccountRepository: IAccountRepository) {
    this.iAccountRepository = iAccountRepository;
  }

  async getAll({ take = 20, skip = 0, date = '' }) {
    return await this.iAccountRepository.getAll({ take, skip, date });
  }

  async getOne(id: number) {
    return await this.iAccountRepository.getOne(id);
  }

  create(input: AccountInput) {
    return this.iAccountRepository.create(input);
  }

  dailyReport(id: number, day: string) {
    return this.iAccountRepository.dailyReport(id, day);
  }
}
