import { NextResponse } from "next/server";
import { PrismaCategoryRepository } from "@/infra/repositories/prisma-category.repository";
import { CreateCategoryUseCase } from "@/core/use-cases/create-category.use-case";
import { ListCategoriesUseCase } from "@/core/use-cases/list-categories.use-case";
import { categorySchema } from "@/shared/category.schema";

const categoryRepository = new PrismaCategoryRepository();

export async function GET() {
  try {
    const listCategories = new ListCategoriesUseCase(categoryRepository);
    const categories = await listCategories.execute();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("ERRO NO GET /api/categories:", error);
    return NextResponse.json({ error: "Erro interno ao listar categorias" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    const createCategory = new CreateCategoryUseCase(categoryRepository);
    const category = await createCategory.execute(validatedData);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("ERRO NO POST /api/categories:", error);
    const message = error.errors
      ? `Validação: ${error.errors.map((e: any) => e.message).join(", ")}`
      : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}