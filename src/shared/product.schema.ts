import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "Eletrônicos",
  "Vestuário",
  "Alimentos",
  "Casa",
  "Papelaria",
  "Beleza",
  "Outros"
] as [string, ...string[]]; // Tipagem explícita para evitar erro de enum

export const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  description: z.string().optional().nullable(),
  sku: z.string().min(3, "SKU muito curto"),
  price: z.number().min(0.01),
  // Removi o objeto { errorMap: ... } que estava dando erro no build
  category: z.enum(PRODUCT_CATEGORIES), 
  imageUrl: z.string().optional().nullable(),
});

export const updateProductSchema = productSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;