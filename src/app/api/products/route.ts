import { NextResponse } from "next/server";
import { PrismaProductRepository } from "@/infra/repositories/prisma-product.repository";
import { CreateProductUseCase } from "@/core/use-cases/create-product.use-case";
import { ListProductsUseCase } from "@/core/use-cases/list-products.use-case";
import { productSchema } from "@/shared/product.schema";

const productRepository = new PrismaProductRepository();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const listProducts = new ListProductsUseCase(productRepository);
    const products = await listProducts.execute({ search, categoryId });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("ERRO NO GET /api/products:", error);
    return NextResponse.json({ error: "Erro interno ao listar produtos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const createProduct = new CreateProductUseCase(productRepository);
    const product = await createProduct.execute(validatedData);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("ERRO NO POST /api/products:", error);
    const message = error.errors
      ? `Validação: ${error.errors.map((e: any) => e.message).join(", ")}`
      : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}