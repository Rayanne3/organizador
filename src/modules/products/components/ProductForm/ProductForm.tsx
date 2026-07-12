/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput, PRODUCT_CATEGORIES } from '@/shared/product.schema';
import { ProductFormProps } from './ProductForm.types';

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      price: 0,
      category: 'Outros',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        sku: initialData.sku,
        price: Number(initialData.price),
        category: (initialData as any).category || 'Outros',
        imageUrl: (initialData as any).imageUrl || '',
      });
    } else {
      reset({ name: '', description: '', sku: '', price: 0, category: 'Outros', imageUrl: '' });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl border border-gray-300 shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">
        {initialData ? '📝 Editar Produto' : '📦 Novo Produto'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800">Nome do Produto</label>
          <input
            {...register('name')}
            className={`border-2 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-400'}`}
            placeholder="Ex: Teclado Mecânico"
          />
          {errors.name && <span className="text-xs font-bold text-red-600">{errors.name.message}</span>}
        </div>

        {/* Categoria - Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800">Categoria</label>
          <select
            {...register('category')}
            className="border-2 border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
          >
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* SKU */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800">SKU (Código Interno)</label>
          <input
            {...register('sku')}
            className={`border-2 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none ${errors.sku ? 'border-red-500' : 'border-gray-400'}`}
            placeholder="Ex: TEC-001"
          />
          {errors.sku && <span className="text-xs font-bold text-red-600">{errors.sku.message}</span>}
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800">Preço de Venda (R$)</label>
          <input
            type="number"
            step="0.01"
            {...register('price')}
            className="border-2 border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
          />
          {errors.price && <span className="text-xs font-bold text-red-600">{errors.price.message}</span>}
        </div>

        {/* Link da Imagem */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-bold text-gray-800">URL da Imagem do Produto</label>
          <input
            {...register('imageUrl')}
            className="border-2 border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="https://exemplo.com/foto-produto.jpg"
          />
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-bold text-gray-800">Descrição Detalhada</label>
          <textarea
            {...register('description')}
            className="border-2 border-gray-400 rounded-lg px-4 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:opacity-50 shadow-lg"
        >
          {isLoading ? 'SALVANDO...' : 'SALVAR PRODUTO'}
        </button>
      </div>
    </form>
  );
};