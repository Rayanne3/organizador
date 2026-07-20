'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '@/shared/product.schema';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { ImageUpload } from '../ImageUpload';
import { ProductFormProps } from './ProductForm.types';

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onManageCategories,
  isLoading,
}) => {
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      price: 0,
      categoryId: '',
      image: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        sku: initialData.sku,
        price: Number(initialData.price),
        categoryId: initialData.categoryId,
        image: initialData.image,
      });
    } else {
      reset({ name: '', description: '', sku: '', price: 0, categoryId: '', image: null });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden animate-fade-in-up"
    >
      <div className="px-6 sm:px-8 py-6 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-[var(--color-ink-900)]">
            {initialData ? 'Editar item' : 'Novo item'}
          </h2>
          <p className="text-sm text-[var(--color-ink-500)] mt-0.5">
            Preencha os detalhes
          </p>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Coluna da imagem */}
        <div>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload value={field.value} onChange={field.onChange} error={errors.image?.message} />
            )}
          />
        </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--color-ink-700)]">Preço de Custo (R$)</label>
            <input
              type="number"
              step="0.01"
              {...register('costPrice', { valueAsNumber: true })}
              className={`px-4 py-3 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.costPrice ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
              placeholder="0,00"
            />
            {errors.costPrice && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.costPrice.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--color-ink-700)]">Preço de Venda (R$)</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className={`px-4 py-3 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.price ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
              placeholder="0,00"
            />
            {errors.price && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.price.message}</span>}
          </div>

        {/* Coluna dos campos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-[var(--color-ink-700)]">Nome do item</label>
            <input
              {...register('name')}
              className={`px-4 py-3 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.name ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
              placeholder="Ex: Risoto de Funghi"
            />
            {errors.name && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--color-ink-700)]">Categoria</label>
              <button
                type="button"
                onClick={onManageCategories}
                className="text-xs font-semibold text-[var(--color-gold-600)] hover:underline"
              >
                Gerenciar
              </button>
            </div>
            <select
              {...register('categoryId')}
              className={`px-4 py-3 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.categoryId ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.categoryId.message}</span>}
            {categories.length === 0 && (
              <span className="text-xs text-[var(--color-ink-500)]">
                Nenhuma categoria criada ainda —{' '}
                <button type="button" onClick={onManageCategories} className="font-semibold text-[var(--color-gold-600)] hover:underline">
                  criar agora
                </button>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--color-ink-700)]">Estoque inicial</label>
            <input
              type="number"
              step="1"
              {...register('stock', { valueAsNumber: true })}
              className={`px-4 py-3 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.stock ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
              placeholder="0"
            />
            {errors.stock && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.stock.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--color-ink-700)]">SKU / código interno</label>
            <input
              {...register('sku')}
              className={`px-4 py-3 rounded-[var(--radius-md)] border bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all ${errors.sku ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
              placeholder="Ex: PRT-014"
            />
            {errors.sku && <span className="text-xs font-semibold text-[var(--color-danger)]">{errors.sku.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-[var(--color-ink-700)]">Descrição</label>
            <textarea
              {...register('description')}
              rows={3}
              className="px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-cream-50)] text-sm font-medium text-[var(--color-ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-all resize-none"
              placeholder="Ingredientes, detalhes, o que torna o item especial..."
            />
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-5 border-t border-[var(--color-border)] bg-[var(--color-cream-100)]/60 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-ink-700)] hover:bg-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-[var(--color-cream-50)] text-sm font-semibold hover:bg-[var(--color-ink-700)] active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
};