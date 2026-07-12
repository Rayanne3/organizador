import React from 'react';
import { ProductTableProps } from './ProductTable.types';

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, isAdmin = false }) => {
  return (
    <div className="overflow-x-auto w-full border border-gray-300 rounded-xl shadow-md">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Produto</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Categoria</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Preço</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
            {/* Coluna de ações só aparece se for Admin */}
            {isAdmin && <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Ações</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 bg-gray-100 border border-gray-200 rounded-md overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase p-1 text-center">
                        Sem Foto
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-gray-900">{product.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                <span className="bg-gray-200 px-3 py-1 rounded-md">
                  {product.category || 'Outros'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{product.sku}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide ${product.status === 'ACTIVE' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                  {product.status === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
                </span>
              </td>
              
              {/* Célula de ações só aparece se for Admin */}
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                  <button 
                    onClick={() => onEdit(product)}
                    className="text-blue-700 hover:text-blue-900 mr-6 transition-colors"
                  >
                    EDITAR
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    EXCLUIR
                  </button>
                </td>
              )}
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-sm font-bold text-gray-500 uppercase">
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};