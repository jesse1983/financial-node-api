import { PrismaClient } from '@prisma/client';
import { EntryRepository } from '../domains/entries/repositories';
import { EntryUseCase } from '../domains/entries/use-cases/entry-use-case';

export default async function (prisma: PrismaClient) {
  const entryRepository = new EntryRepository(prisma);
  const entryUseCase = new EntryUseCase(entryRepository);

  const now = new Date().toISOString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const account = await prisma.account.upsert({
    where: {
      id: 1
    },
    update: {
      currentValue: 10000
    },
    create: {
      title: 'Main account',
      currentValue: 10000
    }
  });

  await prisma.account.upsert({
    where: {
      id: 2
    },
    update: {
      currentValue: 10000
    },
    create: {
      title: 'Secondary account',
      currentValue: 10000
    }
  });

  await prisma.$queryRawUnsafe('TRUNCATE TABLE public."Entry" CASCADE');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE public."Item" CASCADE');

  await entryUseCase.create({
    negotiationType: 'CREDIT',
    date: now,
    customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
    customerName: 'John Wick',
    accountId: account.id,
    items: [
      {
        referenceKey: '0c637428-b8bc-4112-b4a0-f688e66f581c',
        title: 'Notebook Dell Alienware',
        price: 8900,
        discount: 200,
        comments: 'Discount by product showcase'
      },
      {
        referenceKey: 'dde2e115-fa27-4e09-8b8b-2bed51e0ca21',
        title: 'Monitor LG 32 4K',
        price: 2800
      },
      {
        referenceKey: 'ebfd380e-6536-477a-b6c2-7d48831b2e7b',
        title: 'Monitor LG 32 4K',
        price: 2800
      }
    ]
  });

  await entryUseCase.create({
    negotiationType: 'DEBIT',
    customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
    date: yesterday.toISOString(),
    customerName: 'AWS',
    accountId: account.id,
    items: [
      {
        referenceKey: '0c637428-b8bc-4112-b4a0-f688e66f581c',
        title: 'Amazon Account',
        price: 20000
      }
    ]
  });

  return true;
}
