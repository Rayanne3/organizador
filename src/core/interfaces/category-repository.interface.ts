import { Category, CreateCategoryDTO, UpdateCategoryDTO } from "../entities/category.entity";

export interface ICategoryRepository {
  create(data: CreateCategoryDTO & { slug: string }): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(id: string, data: Partial<UpdateCategoryDTO> & { slug?: string }): Promise<Category>;
  delete(id: string): Promise<void>;
  countProducts(id: string): Promise<number>;
}