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
  price: number;      // Preço de Venda
  costPrice: number;  // ADICIONADO: Preço de Custo
  image: string | null;
  stock: number;
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
  costPrice: number; // ADICIONADO
  categoryId: string;
  image?: string | null;
  stock?: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  status?: "ACTIVE" | "INACTIVE";
}