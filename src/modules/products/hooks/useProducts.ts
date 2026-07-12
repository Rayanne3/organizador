'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/core/entities/product.entity';
import { ProductInput } from '@/shared/product.schema';
import { ProductService } from '../services/product.service';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAll({ search, categoryId });
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (data: ProductInput) => {
    setLoading(true);
    try {
      await ProductService.create(data);
      await fetchProducts();
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id: string, data: Partial<ProductInput>) => {
    setLoading(true);
    try {
      await ProductService.update(id, data);
      await fetchProducts();
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    setLoading(true);
    try {
      await ProductService.delete(id);
      await fetchProducts();
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Grava o valor final de estoque (chamado só quando o usuário confirma)
  const adjustStock = async (id: string, newStock: number) => {
    const current = products.find((p) => p.id === id);
    if (!current || newStock === current.stock) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );

    try {
      await ProductService.update(id, { stock: newStock });
    } catch (err: any) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: current.stock } : p))
      );
      alert(err.message || 'Erro ao atualizar estoque');
    }
  };

  return {
    products,
    loading,
    error,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    addProduct,
    editProduct,
    removeProduct,
    adjustStock,
    refresh: fetchProducts,
  };
};