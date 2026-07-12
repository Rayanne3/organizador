import { Product, CreateProductDTO, UpdateProductDTO } from "../entities/product.entity";

export interface ProductFilters {
  search?: string;   // Busca por nome ou SKU
  category?: string; // Filtro por categoria específica
}

export interface IProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>; // Assinatura atualizada
  update(id: string, data: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
}