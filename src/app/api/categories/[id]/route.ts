import { NextResponse } from "next/server";
import { PrismaCategoryRepository } from "@/infra/repositories/prisma-category.repository";
import { UpdateCategoryUseCase } from "@/core/use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "@/core/use-cases/delete-category.use-case";
import { updateCategorySchema } from "@/shared/category.schema";

const categoryRepository = new PrismaCategoryRepository();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const updateCategory = new UpdateCategoryUseCase(categoryRepository);
    const category = await updateCategory.execute(id, validatedData);

    return NextResponse.json(category);
  } catch (error: any) {
    const message = error.errors ? error.errors[0].message : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleteCategory = new DeleteCategoryUseCase(categoryRepository);
    await deleteCategory.execute(id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}