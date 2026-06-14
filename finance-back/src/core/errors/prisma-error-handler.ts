import { Prisma } from '@prisma/client';
import { AppError } from './app-error';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[])?.join(', ') || 'campos';
        throw new AppError(
          `Conflito: Já existe um registro com os valores fornecidos em: ${target}`,
          409,
          'UNIQUE_CONSTRAINT_VIOLATION'
        );
      }
      case 'P2025': {
        throw new AppError(
          error.meta?.cause as string || 'O registro solicitado não foi encontrado no banco de dados',
          404,
          'RECORD_NOT_FOUND'
        );
      }
      case 'P2003': {
        throw new AppError(
          'Erro de chave estrangeira: Um registro associado requerido está ausente.',
          400,
          'FOREIGN_KEY_VIOLATION'
        );
      }
      default:
        throw new AppError(
          `Erro no banco de dados (${error.code}): ${error.message}`,
          400,
          'DATABASE_KNOWN_ERROR'
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new AppError(
      'Dados inválidos enviados para a base de dados',
      400,
      'DATABASE_VALIDATION_ERROR'
    );
  }

  throw error;
}
