import { prisma } from "../db/client";
import { Product, CreateProductDTO, UpdateProductDTO } from "../../core/entities/product.entity";
import { IProductRepository, ProductFilters } from "../../core/interfaces/product-repository.interface";

export class PrismaProductRepository implements IProductRepository {
  private mapProduct(p: any): Product {
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? null,
      sku: p.sku,
      price: Number(p.price),
      image: p.image ?? null,
      stock: p.stock,
      status: p.status as "ACTIVE" | "INACTIVE",
      categoryId: p.categoryId,
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        color: p.category.color ?? null,
      },
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const p = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        image: data.image,
        stock: data.stock ?? 0,
        categoryId: data.categoryId,
        status: 'ACTIVE',
      },
      include: { category: true },
    });
    return this.mapProduct(p);
  }

  async findById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    return p ? this.mapProduct(p) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { sku }, include: { category: true } });
    return p ? this.mapProduct(p) : null;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const where: any = {};

    if (filters?.categoryId && filters.categoryId !== "") {
      where.categoryId = filters.categoryId;
    }

    if (filters?.search && filters.search !== "") {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => this.mapProduct(p));
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const p = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        image: data.image,
        stock: data.stock,
        categoryId: data.categoryId,
        status: data.status,
      },
      include: { category: true },
    });
    return this.mapProduct(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}