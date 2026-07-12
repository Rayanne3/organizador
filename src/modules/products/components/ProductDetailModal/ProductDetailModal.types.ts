import { Product } from "@/core/entities/product.entity";

export interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
}