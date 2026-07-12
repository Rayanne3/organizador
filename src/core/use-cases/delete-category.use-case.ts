import { ICategoryRepository } from "../interfaces/category-repository.interface";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    const productCount = await this.categoryRepository.countProducts(id);
    if (productCount > 0) {
      throw new Error(
        `Não é possível excluir: existem ${productCount} produto(s) nesta categoria. Mova ou exclua os produtos primeiro.`
      );
    }

    await this.categoryRepository.delete(id);
  }
}