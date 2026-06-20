import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../core/database/client';
import { handlePrismaError } from '../../../core/errors/prisma-error-handler';
import { AppError } from '../../../core/errors/app-error';
import { env } from '../../../core/config/env';
import { LoginInput } from '../schemas/auth.schema';

export class AuthService {
  public async login(data: LoginInput): Promise<{ token: string; user: { id: number; email: string; name: string | null } }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
      }

      const passwordMatch = await bcrypt.compare(data.password, user.password);

      if (!passwordMatch) {
        throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      handlePrismaError(error);
    }
  }
}
