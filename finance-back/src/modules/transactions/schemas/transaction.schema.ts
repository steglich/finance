import { z } from 'zod';

export const createTransactionSchema = z.object({
  description: z.string().min(3, 'Descrição precisa ter ao menos 3 caracteres'),
  amount: z.number().positive('O valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().datetime({ message: 'Formato de data inválido (ISO 8601)' }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
