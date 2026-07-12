import { Product } from "@/core/entities/product.entity";
import { ProductInput } from "@/shared/product.schema";
import { ProductFilters } from "@/core/interfaces/product-repository.interface";

const API_URL = "/api/products";

export const ProductService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);

    const queryString = params.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao carregar produtos");
    return response.json();
  },

  async create(data: ProductInput): Promise<Product> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar produto");
    }
    return response.json();
  },

  async update(id: string, data: Partial<ProductInput>): Promise<Product> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao atualizar produto");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir produto");
  },
};