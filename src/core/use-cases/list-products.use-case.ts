import { Product } from "../entities/product.entity";
import { IProductRepository, ProductFilters } from "../interfaces/product-repository.interface";

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return await this.productRepository.findAll(filters);
  }
}