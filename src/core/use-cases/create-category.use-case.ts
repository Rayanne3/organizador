import { CreateCategoryDTO, Category } from "../entities/category.entity";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { slugify } from "@/shared/category.schema";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<Category> {
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) {
      throw new Error("Já existe uma categoria com este nome.");
    }

    const slug = slugify(data.name);

    return await this.categoryRepository.create({ ...data, slug });
  }
}