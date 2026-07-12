'use client';

import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '@/core/entities/category.entity';
import { CategoryManagerProps, CATEGORY_COLOR_PALETTE } from './CategoryManager.types';

export const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
  const { categories, loading, addCategory, editCategory, removeCategory, moveCategory } = useCategories();

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLOR_PALETTE[0].value);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (newName.trim().length < 2) {
      setFormError('Digite um nome com pelo menos 2 letras.');
      return;
    }
    setFormError(null);
    setIsCreating(true);
    try {
      await addCategory({ name: newName.trim(), color: newColor });
      setNewName('');
      setNewColor(CATEGORY_COLOR_PALETTE[0].value);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const commitEditing = async () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (trimmed.length < 2) {
      setEditingId(null);
      return;
    }
    try {
      await editCategory(editingId, { name: trimmed });
    } finally {
      setEditingId(null);
    }
  };

  const changeColor = async (category: Category, color: string) => {
    await editCategory(category.id, { color });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await removeCategory(pendingDelete.id);
      setPendingDelete(null);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-end sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-ink-900)]/40 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
      />

      {/* Painel */}
      <div
        className="relative w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[85vh] bg-[var(--color-cream-50)] sm:rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] flex flex-col overflow-hidden animate-fade-in-up"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-ink-900)]">Categorias</h2>
            <p className="text-sm text-[var(--color-ink-500)] mt-0.5">
              Organize como seus itens aparecem
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-cream-200)] transition-colors text-[var(--color-ink-500)]"
            aria-label="Fechar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Formulário de nova categoria */}
        <div className="px-6 sm:px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-cream-100)]/60">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Nova categoria (ex: Bebidas, Sobremesas...)"
              className="flex-1 min-w-0 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-sm font-medium text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all"
            />
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] text-sm font-semibold hover:bg-[var(--color-ink-700)] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isCreating ? '...' : 'Adicionar'}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs font-semibold text-[var(--color-ink-500)] mr-1">Cor:</span>
            {CATEGORY_COLOR_PALETTE.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() => setNewColor(c.value)}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: c.value,
                  outline: newColor === c.value ? `2px solid ${c.value}` : 'none',
                  outlineOffset: '2px',
                  boxShadow: newColor === c.value ? `0 0 0 2px var(--color-cream-100)` : 'none',
                }}
              />
            ))}
          </div>

          {formError && (
            <p className="text-xs font-semibold text-[var(--color-danger)] mt-2">{formError}</p>
          )}
        </div>

        {/* Lista de categorias */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-4">
          {loading && categories.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-6 h-6 mx-auto border-2 border-[var(--color-gold-500)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-[var(--color-ink-500)]">
                Nenhuma categoria ainda.
              </p>
              <p className="text-xs text-[var(--color-ink-300)] mt-1">
                Crie a primeira acima para começar a organizar.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {categories.map((category, index) => (
                <li
                  key={category.id}
                  className="group flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white hover:shadow-[var(--shadow-soft)] transition-shadow"
                >
                  {/* Setas de reordenação */}
                  <div className="flex flex-col gap-0.5 -ml-1">
                    <button
                      onClick={() => moveCategory(category.id, 'up')}
                      disabled={index === 0}
                      className="w-5 h-5 flex items-center justify-center text-[var(--color-ink-300)] hover:text-[var(--color-ink-700)] disabled:opacity-20 transition-colors"
                      aria-label="Mover para cima"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button
                      onClick={() => moveCategory(category.id, 'down')}
                      disabled={index === categories.length - 1}
                      className="w-5 h-5 flex items-center justify-center text-[var(--color-ink-300)] hover:text-[var(--color-ink-700)] disabled:opacity-20 transition-colors"
                      aria-label="Mover para baixo"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>

                  {/* Cor */}
                  <div className="relative flex-shrink-0 group/color">
                    <div
                      className="w-8 h-8 rounded-full border border-black/5"
                      style={{ backgroundColor: category.color || 'var(--color-gold-500)' }}
                    />
                    <div className="absolute left-0 top-10 hidden group-hover/color:flex gap-1 p-2 bg-white rounded-[var(--radius-sm)] shadow-[var(--shadow-card)] z-10 flex-wrap w-40">
                      {CATEGORY_COLOR_PALETTE.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => changeColor(category, c.value)}
                          className="w-5 h-5 rounded-full hover:scale-110 transition-transform"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Nome (editável inline) */}
                  <div className="flex-1 min-w-0">
                    {editingId === category.id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={commitEditing}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEditing();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-full px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--color-gold-400)] text-sm font-semibold text-[var(--color-ink-900)] focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => startEditing(category)}
                        className="text-sm font-semibold text-[var(--color-ink-900)] hover:text-[var(--color-gold-600)] transition-colors text-left truncate w-full"
                      >
                        {category.name}
                      </button>
                    )}
                  </div>

                  {/* Excluir */}
                  <button
                    onClick={() => { setPendingDelete(category); setDeleteError(null); }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-[var(--color-danger-bg)] text-[var(--color-ink-300)] hover:text-[var(--color-danger)] transition-all"
                    aria-label="Excluir categoria"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-[var(--color-ink-900)]/50 backdrop-blur-sm"
            onClick={() => !isDeleting && setPendingDelete(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] p-6 animate-fade-in-up">
            <h3 className="font-display text-lg text-[var(--color-ink-900)] mb-2">
              Excluir &ldquo;{pendingDelete.name}&rdquo;?
            </h3>
            <p className="text-sm text-[var(--color-ink-500)] mb-5">
              Esta ação não pode ser desfeita. Se houver produtos nesta categoria, mova-os antes de excluir.
            </p>
            {deleteError && (
              <p className="text-xs font-semibold text-[var(--color-danger)] bg-[var(--color-danger-bg)] px-3 py-2 rounded-[var(--radius-sm)] mb-4">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-danger)] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};