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

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-[var(--color-cream-50)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-elevated)] p-8 sm:p-10 animate-fade-in-up">
          <div className="text-center mb-9">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-gold-100)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-600)" strokeWidth="1.5">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-[var(--color-ink-900)]">Acesso administrativo</h1>
            <p className="text-sm text-[var(--color-ink-500)] mt-1.5">Entre para gerenciar OS PRODUTOS</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] text-[var(--color-danger)] font-semibold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--color-ink-700)] uppercase tracking-wide">E-mail</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3.5 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-[var(--color-ink-900)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.email ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
                placeholder="seu@email.com"
              />
              {errors.email && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--color-ink-700)] uppercase tracking-wide">Senha</label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3.5 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-[var(--color-ink-900)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.password ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] font-semibold hover:bg-[var(--color-ink-700)] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[var(--shadow-card)]"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
            <Link href="/" className="text-sm font-semibold text-[var(--color-ink-500)] hover:text-[var(--color-gold-600)] transition-colors">
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}