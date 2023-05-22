import { EntryInput } from '../entities';
import { IEntryRepository } from '../interfaces';

export class EntryUseCase {
  iEntryRepository: IEntryRepository;

  constructor(iEntryRepository: IEntryRepository) {
    this.iEntryRepository = iEntryRepository;
  }

  async getAll({ take = 20, skip = 0, date = '' }) {
    return await this.iEntryRepository.getAll({ take, skip, date });
  }

  async getOne(id: number) {
    return await this.iEntryRepository.getOne(id);
  }

  create(input: EntryInput) {
    return this.iEntryRepository.create(input);
  }
}
