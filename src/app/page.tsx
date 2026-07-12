/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { ProductTable } from '@/modules/products/components/ProductTable';
import { ProductForm } from '@/modules/products/components/ProductForm';
import { CategoryManager } from '@/modules/categories/components/CategoryManager';
import { Product } from '@/core/entities/product.entity';
import { ProductInput } from '@/shared/product.schema';
import Link from 'next/link';

export default function MenuPage() {
  const router = useRouter();
  const {
    products,
    loading,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const { categories } = useCategories();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'GUEST'>('GUEST');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'GUEST'));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUserRole('GUEST');
    setIsFormOpen(false);
    router.refresh();
  };

  const handleSubmit = async (data: ProductInput) => {
    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = (product: Product) => {
    if (userRole !== 'ADMIN') return;
    setEditingProduct(product);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId || isDeletingProduct) return;
    setIsDeletingProduct(true);
    try {
      await removeProduct(pendingDeleteId);
      setPendingDeleteId(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const isAdmin = userRole === 'ADMIN';

  return (
    <main className="min-h-screen bg-[var(--color-cream-50)]">
      {/* Cabeçalho fixo */}
      <header className="sticky top-0 z-30 bg-[var(--color-cream-50)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-[var(--color-ink-900)]">PRODUTOS</h1>
            {isAdmin && (
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-gold-600)] bg-[var(--color-gold-100)] px-2 py-0.5 rounded-full">
                Modo administrador
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsCategoryManagerOpen(true)}
                  className="hidden sm:inline-flex px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-ink-700)] hover:bg-white transition-colors"
                >
                  Categorias
                </button>
                {!isFormOpen && (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 sm:px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] text-sm font-semibold hover:bg-[var(--color-ink-700)] active:scale-95 transition-all whitespace-nowrap"
                  >
                    + Novo item
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold text-[var(--color-ink-500)] hover:bg-[var(--color-cream-200)] transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] text-sm font-semibold hover:bg-[var(--color-ink-700)] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Busca */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-300)" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar item ou código..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[var(--color-border)] bg-white text-sm font-medium text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all"
            />
          </div>
        </div>

        {/* Chips de categoria */}
        {categories.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 flex gap-2 overflow-x-auto no-select" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setCategoryId('')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                categoryId === ''
                  ? 'bg-[var(--color-ink-900)] text-[var(--color-cream-50)]'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-700)] hover:border-[var(--color-gold-400)]'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                  categoryId === cat.id
                    ? 'text-white'
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-700)] hover:border-[var(--color-gold-400)]'
                }`}
                style={categoryId === cat.id ? { backgroundColor: cat.color || 'var(--color-gold-500)' } : undefined}
              >
                {cat.name}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                className="sm:hidden flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border border-dashed border-[var(--color-gold-400)] text-[var(--color-gold-600)]"
              >
                + Categorias
              </button>
            )}
          </div>
        )}
      </header>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {isFormOpen && isAdmin && (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
            onManageCategories={() => setIsCategoryManagerOpen(true)}
            isLoading={loading}
          />
        )}

        {categories.length === 0 && isAdmin && !isFormOpen && (
          <div className="text-center py-16 px-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-gold-400)] bg-[var(--color-gold-100)]/40">
            <p className="font-display text-xl text-[var(--color-ink-900)] mb-2">Comece criando suas categorias</p>
            <p className="text-sm text-[var(--color-ink-500)] mb-5">
              Elas organizam como os itens aparecem,você define os nomes.
            </p>
            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] text-sm font-semibold hover:bg-[var(--color-ink-700)] transition-colors"
            >
              Criar categorias
            </button>
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-[var(--color-gold-500)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={(id) => setPendingDeleteId(id)}
            isAdmin={isAdmin}
          />
        )}
      </div>

      <CategoryManager isOpen={isCategoryManagerOpen} onClose={() => setIsCategoryManagerOpen(false)} />

      {/* Confirmação de exclusão de produto */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-[var(--color-ink-900)]/50 backdrop-blur-sm"
            onClick={() => !isDeletingProduct && setPendingDeleteId(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] p-6 animate-fade-in-up">
            <h3 className="font-display text-lg text-[var(--color-ink-900)] mb-2">Excluir este item?</h3>
            <p className="text-sm text-[var(--color-ink-500)] mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                disabled={isDeletingProduct}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeletingProduct}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-danger)] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeletingProduct ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}