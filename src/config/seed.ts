import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import seeder from './seeder';

const prisma = new PrismaClient();

seeder(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
