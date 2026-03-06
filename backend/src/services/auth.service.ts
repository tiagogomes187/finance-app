import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

// ─── Tipos ────────────────────────────────────────────────────────────

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// ─── Serviço ──────────────────────────────────────────────────────────

export class AuthService {

  // Cadastro de novo usuário
  async register(data: RegisterData) {
    // 1. Verifica se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('E-mail já cadastrado.');
    }

    // 2. Criptografa a senha (nunca salvamos senha pura no banco!)
    // O número 10 é o "salt rounds" — quanto maior, mais seguro e mais lento
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Cria o usuário no banco
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // 4. Cria categorias padrão para o novo usuário
    await this.createDefaultCategories(user.id);

    // 5. Gera o token JWT
    const token = this.generateToken(user.id, user.email);

    // 6. Retorna os dados do usuário (sem a senha!) e o token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      token,
    };
  }

  // Login de usuário existente
  async login(data: LoginData) {
    // 1. Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Mensagem genérica por segurança (não revela se e-mail existe)
    if (!user) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 2. Compara a senha digitada com a senha criptografada no banco
    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 3. Gera o token JWT
    const token = this.generateToken(user.id, user.email);

    // 4. Retorna os dados do usuário e o token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
      },
      token,
    };
  }

  // Gera o token JWT
  private generateToken(userId: number, email: string): string {
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      { id: userId, email }, // payload (dados dentro do token)
      secret,
      { expiresIn } as jwt.SignOptions
    );
  }

  // Cria categorias padrão ao cadastrar novo usuário
  private async createDefaultCategories(userId: number) {
    const defaultCategories = [
      // Despesas
      { name: 'Alimentação',    type: 'EXPENSE' as const, color: '#ef4444', icon: 'utensils' },
      { name: 'Transporte',     type: 'EXPENSE' as const, color: '#f97316', icon: 'car' },
      { name: 'Moradia',        type: 'EXPENSE' as const, color: '#eab308', icon: 'home' },
      { name: 'Saúde',          type: 'EXPENSE' as const, color: '#22c55e', icon: 'heart' },
      { name: 'Educação',       type: 'EXPENSE' as const, color: '#3b82f6', icon: 'book' },
      { name: 'Lazer',          type: 'EXPENSE' as const, color: '#a855f7', icon: 'gamepad' },
      { name: 'Vestuário',      type: 'EXPENSE' as const, color: '#ec4899', icon: 'shirt' },
      { name: 'Assinaturas',    type: 'EXPENSE' as const, color: '#14b8a6', icon: 'tv' },
      { name: 'Outros gastos',  type: 'EXPENSE' as const, color: '#6b7280', icon: 'more-horizontal' },
      // Receitas
      { name: 'Salário',        type: 'INCOME' as const,  color: '#22c55e', icon: 'briefcase' },
      { name: 'Freelance',      type: 'INCOME' as const,  color: '#3b82f6', icon: 'laptop' },
      { name: 'Investimentos',  type: 'INCOME' as const,  color: '#a855f7', icon: 'trending-up' },
      { name: 'Outras receitas',type: 'INCOME' as const,  color: '#6b7280', icon: 'plus-circle' },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId,
        isDefault: true,
      })),
    });
  }
}