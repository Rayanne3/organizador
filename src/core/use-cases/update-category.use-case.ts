import { Category, UpdateCategoryDTO } from "../entities/category.entity";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { slugify } from "@/shared/category.schema";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.findByName(data.name);
      if (existing) {
        throw new Error("Já existe uma categoria com este nome.");
      }
    }

    const slug = data.name ? slugify(data.name) : undefined;

    return await this.categoryRepository.update(id, { ...data, slug });
  }
}