import { Product } from "@/core/entities/product.entity";
import { ProductInput } from "@/shared/product.schema";

export interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  onManageCategories: () => void;
  isLoading?: boolean;
}