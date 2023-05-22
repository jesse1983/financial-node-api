import { Results } from '../../../entities';
import { Account, AccountInput, DailyReport } from '../entities';

type getAllParams = {
  take?: number;
  skip?: number;
  date?: string;
};

export interface IAccountRepository {
  getAll(param: getAllParams): Promise<Results<Account>>;
  getOne(id: number): Promise<Account>;
  create(input: AccountInput): Promise<Account>;
  dailyReport(id: number, day: string): Promise<DailyReport>;
}
