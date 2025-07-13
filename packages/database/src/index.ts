import { PrismaClient } from '@prisma/client';

export { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient to avoid connection issues
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
};

export default prisma;
