import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Placeholder para autenticação futura
  next();
};
