import { RecordNotFoundException, Results } from '../../../entities';
import { IAccountRepository } from '../interfaces';
import { NegotiationType, PrismaClient } from '@prisma/client';
import { Account, AccountInput, DailyReport } from '../entities';
import { EntryRepository } from '../../entries/repositories';

export class AccountRepository implements IAccountRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
  async getAll({
    take,
    skip
  }: {
    take: number;
    skip: number;
  }): Promise<Results<Account>> {
    const [accounts, count] = await this.prismaClient.$transaction([
      this.prismaClient.account.findMany({ take, skip }),
      this.prismaClient.account.count()
    ]);
    return { total: count, data: accounts };
  }

  async getOne(id: number): Promise<Account> {
    const account = await this.prismaClient.account.findUnique({
      where: { id }
    });
    if (account) return account;
    throw new RecordNotFoundException(id);
  }

  async create(input: AccountInput): Promise<Account> {
    return await this.prismaClient.account.create({
      data: {
        title: input.title,
        currentValue: input.currentValue
      }
    });
  }

  async dailyReport(id: number, day: string): Promise<DailyReport> {
    const account = await this.getOne(id);
    const entryRepository = new EntryRepository(this.prismaClient);
    const entries = await entryRepository.getAll({
      take: 1000,
      skip: 0,
      date: day,
      accountId: account.id
    });

    const currentDailyValue = entries.data
      .map((entry) => {
        const multiply =
          entry.negotiationType === NegotiationType.CREDIT ? 1 : -1;
        return entry.totalPrice * multiply;
      })
      .reduce((p, n) => p + n, 0);

    return {
      currentDailyValue,
      entries: entries.data
    };
  }
}
