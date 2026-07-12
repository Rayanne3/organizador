import { Category } from "../entities/category.entity";
import { ICategoryRepository } from "../interfaces/category-repository.interface";

export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}