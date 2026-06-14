import { prisma } from '../../../core/database/client';
import { handlePrismaError } from '../../../core/errors/prisma-error-handler';
import { CreateTransactionInput } from '../schemas/transaction.schema';
import { Transaction } from '@prisma/client';

export class TransactionRepository {
  public async create(data: CreateTransactionInput): Promise<Transaction> {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          description: data.description,
          amount: data.amount,
          type: data.type,
          date: new Date(data.date),
        },
      });

      return transaction;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async findAll(): Promise<Transaction[]> {
    try {
      return await prisma.transaction.findMany({
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async findById(id: string): Promise<Transaction | null> {
    try {
      return await prisma.transaction.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await prisma.transaction.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
