export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  category: string;
  imageUrl: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  sku: string;
  price: number;
  category: string;
  imageUrl?: string | null;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  status?: "ACTIVE" | "INACTIVE";
}