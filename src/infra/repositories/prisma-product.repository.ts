import { prisma } from "../db/client";
import { Product, CreateProductDTO, UpdateProductDTO } from "../../core/entities/product.entity";
import { IProductRepository, ProductFilters } from "../../core/interfaces/product-repository.interface";

export class PrismaProductRepository implements IProductRepository {
  // Função auxiliar para garantir que o objeto de retorno combine com a Interface
  private mapProduct(p: any): Product {
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? null,
      sku: p.sku,
      price: Number(p.price),
      category: p.category,
      imageUrl: p.imageUrl ?? null,
      status: p.status as "ACTIVE" | "INACTIVE",
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
        category: data.category,
        imageUrl: data.imageUrl,
        status: 'ACTIVE',
      }
    });
    return this.mapProduct(p);
  }

  async findById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { id } });
    return p ? this.mapProduct(p) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { sku } });
    return p ? this.mapProduct(p) : null;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const where: any = {};

    if (filters?.category && filters.category !== "") {
      where.category = filters.category;
    }

    if (filters?.search && filters.search !== "") {
      where.OR = [
        { name: { contains: filters.search } },
        { sku: { contains: filters.search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return products.map(p => this.mapProduct(p));
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const p = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        status: data.status,
      }
    });
    return this.mapProduct(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}