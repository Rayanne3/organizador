import { prisma } from "../db/client";
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from "../../core/entities/category.entity";
import { ICategoryRepository } from "../../core/interfaces/category-repository.interface";

export class PrismaCategoryRepository implements ICategoryRepository {
  private mapCategory(c: any): Category {
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      color: c.color ?? null,
      order: c.order,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async create(data: CreateCategoryDTO & { slug: string }): Promise<Category> {
    // Se não vier "order", coloca no final da lista
    let order = data.order;
    if (order === undefined) {
      const last = await prisma.category.findFirst({ orderBy: { order: "desc" } });
      order = last ? last.order + 1 : 0;
    }

    const c = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        color: data.color,
        order,
      },
    });
    return this.mapCategory(c);
  }

  async findById(id: string): Promise<Category | null> {
    const c = await prisma.category.findUnique({ where: { id } });
    return c ? this.mapCategory(c) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const c = await prisma.category.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    return c ? this.mapCategory(c) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
    return categories.map((c) => this.mapCategory(c));
  }

  async update(id: string, data: Partial<UpdateCategoryDTO> & { slug?: string }): Promise<Category> {
    const c = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        color: data.color,
        order: data.order,
      },
    });
    return this.mapCategory(c);
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async countProducts(id: string): Promise<number> {
    return await prisma.product.count({ where: { categoryId: id } });
  }
}