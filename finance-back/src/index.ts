import express, { Request, Response } from 'express';
import { env } from './core/config/env';
import { errorHandler } from './core/middlewares/error.middleware';
import { transactionRoutes } from './modules/transactions';

const app = express();
const PORT = env.PORT;

// Middlewares Globais
app.use(express.json());

// Registro Modular de Rotas
app.use('/api/v1/transactions', transactionRoutes);

// Rota de Healthcheck
app.get('/check', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Tratamento centralizado de erros (DEVE ser o último middleware registrado)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`🔍 Rota de check disponível em: http://localhost:${PORT}/check`);
});
