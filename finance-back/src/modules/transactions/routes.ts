import { Router } from 'express';
import { TransactionController } from './controllers/transaction.controller';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { createTransactionSchema } from './schemas/transaction.schema';

const router = Router();
const controller = new TransactionController();

router.post(
  '/',
  validateRequest({ body: createTransactionSchema }),
  controller.create
);

export default router;
