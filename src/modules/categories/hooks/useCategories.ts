'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/core/entities/category.entity';
import { CategoryInput } from '@/shared/category.schema';
import { CategoryService } from '../services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (data: CategoryInput) => {
    const created = await CategoryService.create(data);
    await fetchCategories();
    return created;
  };

  const editCategory = async (id: string, data: Partial<CategoryInput>) => {
    await CategoryService.update(id, data);
    await fetchCategories();
  };

  const removeCategory = async (id: string) => {
    await CategoryService.delete(id);
    await fetchCategories();
  };

  const moveCategory = async (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((c) => c.id === id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    setCategories(reordered); // atualização otimista, some o delay visual

    await CategoryService.reorder(
      reordered.map((c, i) => ({ id: c.id, order: i }))
    );
    await fetchCategories();
  };

  return {
    categories,
    loading,
    addCategory,
    editCategory,
    removeCategory,
    moveCategory,
    refresh: fetchCategories,
  };
};