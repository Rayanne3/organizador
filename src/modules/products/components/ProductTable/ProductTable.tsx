import React from 'react';
import { ProductTableProps } from './ProductTable.types';

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, onAdjustStock, isAdmin = false }) => {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-xl text-[var(--color-ink-500)]">Nenhum item encontrado</p>
        <p className="text-sm text-[var(--color-ink-300)] mt-1">
          Ajuste os filtros ou adicione um novo item ao cardápio
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative flex flex-col bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300"
        >
          <div className="relative aspect-[4/3] w-full bg-[var(--color-cream-100)] overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream-300)" strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}

            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white shadow"
              style={{ backgroundColor: product.category.color || 'var(--color-gold-500)' }}
            >
              {product.category.name}
            </span>

            {product.status === 'INACTIVE' && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/90 text-[var(--color-danger)]">
                Inativo
              </span>
            )}

            {product.stock === 0 && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--color-danger)] text-white shadow">
                Esgotado
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col p-4 gap-1.5">
            <h3 className="font-display text-base text-[var(--color-ink-900)] leading-snug">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-[var(--color-ink-500)] line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="font-display text-lg text-[var(--color-gold-600)]">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </span>
              <span className="text-[10px] font-mono text-[var(--color-ink-300)]">{product.sku}</span>
            </div>

            {/* Controle de estoque */}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-[var(--color-border)]/70">
              <span className="text-xs font-semibold text-[var(--color-ink-500)]">
                {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'}
              </span>

              {isAdmin && onAdjustStock && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAdjustStock(product.id, -1)}
                    disabled={product.stock === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Diminuir estoque"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[var(--color-ink-900)]">
                    {product.stock}
                  </span>
                  <button
                    onClick={() => onAdjustStock(product.id, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] active:scale-90 transition-all"
                    aria-label="Aumentar estoque"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="flex border-t border-[var(--color-border)]">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] transition-colors"
              >
                Editar
              </button>
              <div className="w-px bg-[var(--color-border)]" />
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};