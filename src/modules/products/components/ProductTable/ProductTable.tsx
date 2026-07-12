import React from 'react';
import { ProductTableProps } from './ProductTable.types';

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, isAdmin = false }) => {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-xl text-[var(--color-ink-500)]">Nenhum item encontrado</p>
        <p className="text-sm text-[var(--color-ink-300)] mt-1">
          Ajuste os filtros ou adicione um novo item.
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
          {/* Imagem */}
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

            {/* Badge de categoria */}
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white shadow"
              style={{ backgroundColor: product.category.color || 'var(--color-gold-500)' }}
            >
              {product.category.name}
            </span>

            {/* Status */}
            {product.status === 'INACTIVE' && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/90 text-[var(--color-danger)]">
                Inativo
              </span>
            )}
          </div>

          {/* Conteúdo */}
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
          </div>

          {/* Ações (admin) */}
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