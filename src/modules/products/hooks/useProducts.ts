'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/core/entities/product.entity';
import { ProductInput } from '@/shared/product.schema';
import { ProductService } from '../services/product.service';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para Filtros
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAll({ search, category });
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category]); // Recarrega quando os filtros mudam

  useEffect(() => {
    // Implementação básica: busca imediata ao digitar
    // Em produção, aqui poderia haver um 'debounce'
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
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    setLoading(true);
    try {
      await ProductService.delete(id);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    addProduct,
    editProduct,
    removeProduct,
    refresh: fetchProducts,
  };
};