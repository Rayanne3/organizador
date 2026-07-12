import { Product } from "@/core/entities/product.entity";

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean; // Adicionada esta propriedade opcional
}