import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { withAccelerate } from '@prisma/extension-accelerate';
dotenv.config();

const prisma = new PrismaClient().$extends(withAccelerate());
const PORT = process.env.PORT || 5001;

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Db connected');
  } catch (err: any) {
    await prisma.$disconnect();
    console.error(`${err} disconnected`);
    process.exit(1);
  }
};

export { connectDB, PORT };
