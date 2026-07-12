'use client';

import { useState } from 'react';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { ProductTable } from '@/modules/products/components/ProductTable';
import { ProductForm } from '@/modules/products/components/ProductForm';
import { Product } from '@/core/entities/product.entity';
import { ProductInput, PRODUCT_CATEGORIES } from '@/shared/product.schema';

export default function ProductOrganizerPage() {
  const { 
    products, 
    loading, 
    search, 
    setSearch, 
    category, 
    setCategory, 
    addProduct, 
    editProduct, 
    removeProduct 
  } = useProducts();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    setEditingProduct(product);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-xl border border-gray-300 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">ORGANIZADOR ODS</h1>
            <p className="text-gray-700 font-medium mt-2">Gestão profissional de estoque e catálogo</p>
          </div>
          
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95"
            >
              + NOVO PRODUTO
            </button>
          )}
        </header>

        <div className="space-y-8">
          {/* Seção do Formulário */}
          {isFormOpen && (
            <section className="animate-in slide-in-from-top-4 duration-300">
              <ProductForm 
                initialData={editingProduct} 
                onSubmit={handleSubmit} 
                onCancel={handleCancel}
                isLoading={loading}
              />
            </section>
          )}

          {/* Filtros e Busca */}
          <section className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-700 uppercase">Pesquisar</label>
              <input
                type="text"
                placeholder="Nome ou SKU do produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-500"
              />
            </div>

            <div className="w-full md:w-64 flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-700 uppercase">Filtrar por Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="">TODAS AS CATEGORIAS</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Listagem de Produtos */}
          <section className="bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden">
            <div className="p-5 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">📦 Inventário</h2>
            </div>
            
            {loading && products.length === 0 ? (
              <div className="p-20 text-center font-bold text-gray-500 text-lg">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <br />Sincronizando banco de dados...
              </div>
            ) : (
              <ProductTable 
                products={products} 
                onEdit={handleEdit} 
                onDelete={removeProduct} 
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}