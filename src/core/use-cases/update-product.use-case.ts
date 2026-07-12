import { Product, UpdateProductDTO } from "../entities/product.entity";
import { IProductRepository } from "../interfaces/product-repository.interface";

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    // Se estiver tentando mudar o SKU, verifica se o novo SKU já existe em outro produto
    if (data.sku && data.sku !== product.sku) {
      const existingProduct = await this.productRepository.findBySku(data.sku);
      if (existingProduct) {
        throw new Error("O SKU informado já está em uso por outro produto.");
      }
    }

    return await this.productRepository.update(id, data);
  }
}