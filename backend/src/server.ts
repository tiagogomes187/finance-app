import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes        from './routes/auth.routes';
import accountRoutes     from './routes/account.routes';
import categoryRoutes    from './routes/category.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// ─── Middlewares Globais ───────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ─── Rotas ────────────────────────────────────────────────────────────
app.use('/auth',         authRoutes);
app.use('/accounts',     accountRoutes);
app.use('/categories',   categoryRoutes);
app.use('/transactions', transactionRoutes);

// ─── Health check ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 FinanceApp API está rodando!',
    timestamp: new Date().toISOString(),
  });
});

// ─── Inicia o servidor ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Ambiente: ${process.env.NODE_ENV}`);
});

export default app;