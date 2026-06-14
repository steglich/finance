import { Request, Response, NextFunction } from 'express';

export class TransactionController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body;

      // Simulação de criação / chamada do service
      const transaction = {
        id: '123-uuid',
        ...payload,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
}
