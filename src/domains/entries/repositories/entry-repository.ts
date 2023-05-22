import { NegotiationType, Prisma } from '@prisma/client';
import {
  RecordNotFoundException,
  Results,
  ValidationRecordException
} from '../../../entities';
import { IEntryRepository } from '../interfaces';
import { PrismaClient } from '@prisma/client';
import { Entry, EntryInput } from '../entities';
import { entryValidation } from '../validations';

export class EntryRepository implements IEntryRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  private getDateRange(dateStr: string) {
    const date = new Date(dateStr);
    const nextDay = new Date(dateStr);
    nextDay.setDate(date.getDate() + 1);
    return { gte: date.toISOString(), lt: nextDay.toISOString() };
  }

  private validate(input: EntryInput): void {
    const validate = entryValidation.safeParse(input);
    if (!validate.success) {
      throw new ValidationRecordException(validate.error);
    }
  }

  private calculateTotalPrice(input: EntryInput) {
    const total = input.items
      .map((item) => item.price - (item.discount || 0))
      .reduce((p, n) => p + n, 0);
    return total - (input.discount || 0);
  }

  private async getAccountById(id: number) {
    const account = await this.prismaClient.account.findUnique({
      where: { id }
    });
    if (account) return account;
    throw new RecordNotFoundException(id);
  }

  private async updateAccountById(id: number, entry: Entry) {
    const account = await this.getAccountById(id);
    const multiply = entry.negotiationType === NegotiationType.CREDIT ? 1 : -1;
    await this.prismaClient.account.update({
      where: { id },
      data: {
        ...account,
        currentValue: account.currentValue + entry.totalPrice * multiply
      }
    });
  }
  async getAll({
    take,
    skip,
    date,
    accountId
  }: {
    take: number;
    skip: number;
    date: string;
    accountId: number;
  }): Promise<Results<Entry>> {
    const where: Prisma.EntryWhereInput = {};
    if (date) where.date = this.getDateRange(date);
    if (accountId) where.accountId = accountId;

    const [entries, count] = await this.prismaClient.$transaction([
      this.prismaClient.entry.findMany({
        take,
        skip,
        where,
        include: {
          items: true
        },
        orderBy: {
          date: 'desc'
        }
      }),
      this.prismaClient.entry.count({ where })
    ]);
    return { total: count, data: entries };
  }

  async getOne(id: number): Promise<Entry> {
    const entry = await this.prismaClient.entry.findUnique({
      where: { id },
      include: { items: true }
    });
    if (entry) return entry;
    throw new RecordNotFoundException(id);
  }

  async create(input: EntryInput): Promise<Entry> {
    this.validate(input);
    const account = await this.getAccountById(input.accountId);
    const created = await this.prismaClient.entry.create({
      data: {
        date: input.date,
        negotiationType: input.negotiationType,
        accountId: input.accountId,
        customerKey: input.customerKey,
        customerName: input.customerName,
        totalPrice: this.calculateTotalPrice(input),
        discount: input.discount,
        previousAccountValue: account.currentValue,
        items: {
          create: input.items
        }
      }
    });
    await this.updateAccountById(account.id, created);
    return created;
  }
}
