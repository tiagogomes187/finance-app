import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// ── Schema de validação ───────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('E-mail inválido'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path:    ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

// ── Componente ────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    try {
      setError('');
      const result = await authService.register({
        name:     data.name,
        email:    data.email,
        password: data.password,
      });
      setAuth(result.user, result.token);
      navigate('/dashboard');
    } catch (err) {
  const error = err as { response?: { data?: { error?: string } } };
  setError(error.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
}
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 
                    flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 
                          bg-white rounded-2xl shadow-lg mb-4">
            <TrendingUp size={32} className="text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">FinanceApp</h1>
          <p className="text-primary-200 mt-1">Crie sua conta gratuitamente</p>
        </div>

        {/* Card do formulário */}
        <div className="card p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Criar conta
          </h2>

          {/* Erro geral */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 
                            rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="João Silva"
              leftIcon={<User size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
              className="mt-2"
            >
              Criar conta
            </Button>
          </form>

          {/* Link para login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Fazer login
            </Link>
          </p>
        </div>

        <p className="text-center text-primary-300 text-xs mt-6">
          © 2026 FinanceApp. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}