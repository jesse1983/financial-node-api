import { Results } from '../../../entities';
import { Entry, EntryInput } from '../entities';

type getAllParams = {
  take?: number;
  skip?: number;
  date?: string;
  accountId?: number;
};

export interface IEntryRepository {
  getAll(param: getAllParams): Promise<Results<Entry>>;
  getOne(id: number): Promise<Entry>;
  create(input: EntryInput): Promise<Entry>;
}
