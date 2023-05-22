import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prismaClient';

const start = () => {
  const port = process.env.PORT;
  const host = process.env.HOST;
  try {
    app(prisma).listen(port, () => {
      console.log(`Api running at ${host}:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

start();
