import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// ─── Middlewares Globais ───────────────────────────────────────────────
// Permite receber JSON no corpo das requisições
app.use(express.json());

// Permite que o frontend acesse a API (Cross-Origin Resource Sharing)
app.use(cors({
  origin: 'http://localhost:5173', // porta padrão do Vite (frontend)
  credentials: true,
}));

// ─── Rota de teste ────────────────────────────────────────────────────
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