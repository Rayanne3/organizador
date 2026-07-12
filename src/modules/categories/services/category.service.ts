import { Category } from "@/core/entities/category.entity";
import { CategoryInput } from "@/shared/category.schema";

const API_URL = "/api/categories";

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao carregar categorias");
    return response.json();
  },

  async create(data: CategoryInput): Promise<Category> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar categoria");
    }
    return response.json();
  },

  async update(id: string, data: Partial<CategoryInput>): Promise<Category> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao atualizar categoria");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao excluir categoria");
    }
  },

  async reorder(categories: { id: string; order: number }[]): Promise<void> {
    // Atualiza a ordem em paralelo (lista costuma ser curta)
    await Promise.all(
      categories.map((c) =>
        fetch(`${API_URL}/${c.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: c.order }),
        })
      )
    );
  },
};