import { CreateProductDTO, Product } from "../entities/product.entity";
import { IProductRepository } from "../interfaces/product-repository.interface";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const existingProduct = await this.productRepository.findBySku(data.sku);

    if (existingProduct) {
      throw new Error("Já existe um produto cadastrado com este SKU.");
    }

    // O Repositório cuidará de injetar o status: 'ACTIVE' e gerar o ID
    return await this.productRepository.create(data);
  }
}