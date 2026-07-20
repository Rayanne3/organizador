'use client';

import React, { useEffect } from 'react';
import { ProductDetailModalProps } from './ProductDetailModal.types';

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, isAdmin, onEdit }) => {
  // Fecha com a tecla Esc (útil quando há teclado conectado ao tablet)
  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-[var(--color-ink-900)]/50 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-[var(--color-cream-50)] rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-[var(--color-ink-700)] shadow transition-colors"
          aria-label="Fechar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto">
          {/* Imagem */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[var(--color-cream-100)]">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream-300)" strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}

            <span
              className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow"
              style={{ backgroundColor: product.category.color || 'var(--color-gold-500)' }}
            >
              {product.category.name}
            </span>

            {product.status === 'INACTIVE' && (
              <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white/90 text-[var(--color-danger)]">
                Inativo
              </span>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-ink-900)] leading-snug">
                {product.name}
              </h2>
              <p className="font-display text-2xl text-[var(--color-gold-600)] mt-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-500)] mb-2">
                  Descrição
                </h3>
                <p className="text-sm text-[var(--color-ink-700)] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Detalhes em grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">SKU</span>
                <p className="text-sm font-mono font-semibold text-[var(--color-ink-900)] mt-0.5">{product.sku}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">Categoria</span>
                <p className="text-sm font-semibold text-[var(--color-ink-900)] mt-0.5">{product.category.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">Estoque</span>
                <p className={`text-sm font-semibold mt-0.5 ${product.stock === 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-ink-900)]'}`}>
                  {product.stock === 0 ? 'Esgotado' : `${product.stock} ${product.stock === 1 ? 'unidade' : 'unidades'}`}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">Status</span>
                <p className="text-sm font-semibold text-[var(--color-ink-900)] mt-0.5">
                  {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">Preço de Custo</span>
                <p className="text-sm font-semibold text-[var(--color-gold-600)] mt-0.5">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.costPrice)}
                </p>
              </div>
            </div>

            {isAdmin && onEdit && (
              <button
                onClick={() => { onEdit(product); onClose(); }}
                className="w-full sm:w-auto sm:self-start px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] text-sm font-semibold hover:bg-[var(--color-ink-700)] active:scale-95 transition-all"
              >
                Editar este item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};