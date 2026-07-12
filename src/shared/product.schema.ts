import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "Eletrônicos",
  "Vestuário",
  "Alimentos",
  "Casa",
  "Papelaria",
  "Beleza",
  "Outros"
] as const;

export const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional().nullable(),
  sku: z.string().min(3, "O SKU deve ter no mínimo 3 caracteres"),
  // Definição mais simples possível para o número
  price: z.number().min(0.01, "O preço deve ser maior que zero"),
  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: "Selecione uma categoria válida" }),
  }),
  imageUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
});

export const updateProductSchema = productSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;