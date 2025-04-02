'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { Loader2, Sparkle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    setError('');
    try {
      const { confirmPassword, ...registerData } = data;
      await authService.signUp(registerData);
      router.push('/login?registered=true');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao criar conta');
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 card-dark p-8 rounded-2xl animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkle className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-extrabold text-white">
              Crie sua conta
            </h2>
          </div>
          <p className="text-gray-400">
            Comece sua jornada com o MyBot
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nome completo
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu nome completo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirmar senha
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Criar conta'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}