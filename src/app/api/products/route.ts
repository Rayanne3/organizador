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
    const category = searchParams.get("category") || undefined;

    const listProducts = new ListProductsUseCase(productRepository);
    const products = await listProducts.execute({ search, category });
    
    return NextResponse.json(products);
  } catch (error: any) {
    // Log crítico para vermos o erro 500 no terminal
    console.error("ERRO NO GET /api/products:", error);
    return NextResponse.json({ error: "Erro interno ao listar produtos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação Zod
    const validatedData = productSchema.parse(body);
    
    const createProduct = new CreateProductUseCase(productRepository);
    const product = await createProduct.execute(validatedData);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    // Log detalhado para o erro 400
    console.error("ERRO NO POST /api/products:", error);

    const message = error.errors 
      ? `Validação: ${error.errors.map((e: any) => e.message).join(", ")}` 
      : error.message;

    return NextResponse.json({ error: message }, { status: 400 });
  }
}