import { NextResponse } from "next/server";
import { PrismaProductRepository } from "@/infra/repositories/prisma-product.repository";
import { UpdateProductUseCase } from "@/core/use-cases/update-product.use-case";
import { DeleteProductUseCase } from "@/core/use-cases/delete-product.use-case";
import { updateProductSchema } from "@/shared/product.schema";

const productRepository = new PrismaProductRepository();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params agora é Promise
) {
  try {
    const { id } = await params; // Unwrapping a Promise
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const updateProduct = new UpdateProductUseCase(productRepository);
    const product = await updateProduct.execute(id, validatedData);

    return NextResponse.json(product);
  } catch (error: any) {
    const message = error.errors ? error.errors[0].message : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> } // params agora é Promise
) {
  try {
    const { id } = await params; // Unwrapping a Promise
    const deleteProduct = new DeleteProductUseCase(productRepository);
    await deleteProduct.execute(id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}