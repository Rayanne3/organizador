'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/shared/auth.schema';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao realizar login');
      }

      // Login bem sucedido, redireciona para a home
      router.push('/');
      router.refresh(); // Garante que o Next.js revalide o estado de autenticação
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-gray-300 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">ACESSO ADMIN</h1>
          <p className="text-gray-600 font-medium">Organizador ODS</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-700 uppercase">E-mail</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-400'}`}
              placeholder="admin@ods.com"
            />
            {errors.email && <span className="text-xs font-bold text-red-600">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-700 uppercase">Senha</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-400'}`}
              placeholder="••••••••"
            />
            {errors.password && <span className="text-xs font-bold text-red-600">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'AUTENTICANDO...' : 'ENTRAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-blue-700 transition-colors">
            ← VOLTAR COMO CONVIDADO
          </Link>
        </div>
      </div>
    </main>
  );
}