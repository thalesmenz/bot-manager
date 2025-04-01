'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Conta criada com sucesso! Faça login para continuar.');
    }
  }, [searchParams]);

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError('');
    try {
      await authService.signIn(data);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao fazer login');
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 glass-effect p-8 rounded-lg card-hover">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Ou{' '}
            <a href="#" className="font-medium text-primary hover:text-primary/90">
              crie uma nova conta
            </a>
          </p>
        </div>
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded">
            {success}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border bg-accent text-foreground placeholder-muted-foreground rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                {...register('password')}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border bg-accent text-foreground placeholder-muted-foreground rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover-glow"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/90">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 