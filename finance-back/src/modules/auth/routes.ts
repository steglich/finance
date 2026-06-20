import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { loginSchema } from './schemas/auth.schema';

const router = Router();
const controller = new AuthController();

router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  controller.login
);

export default router;
