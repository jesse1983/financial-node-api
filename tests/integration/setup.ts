import { execSync } from 'child_process';
import seeder from '../../src/config/seeder';
import { PrismaClient } from '@prisma/client';

export default async function () {
  console.log('DATABASE_URL', process.env.DATABASE_URL);

  await execSync('docker-compose up db-test -d');
  await execSync('npx prisma db push');
  await seeder(new PrismaClient());
}
