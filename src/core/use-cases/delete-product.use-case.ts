import { IProductRepository } from "../interfaces/product-repository.interface";

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Produto não encontrado para exclusão.");
    }

    await this.productRepository.delete(id);
  }
}