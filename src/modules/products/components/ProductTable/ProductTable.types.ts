import { Product } from "@/core/entities/product.entity";

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdjustStock?: (id: string, delta: number) => void;
  isAdmin?: boolean;
}