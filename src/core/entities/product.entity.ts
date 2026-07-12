export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  image: string | null; // base64 data URL (ex: "data:image/jpeg;base64,...")
  status: "ACTIVE" | "INACTIVE";
  categoryId: string;
  category: ProductCategoryRef;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  sku: string;
  price: number;
  categoryId: string;
  image?: string | null;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  status?: "ACTIVE" | "INACTIVE";
}