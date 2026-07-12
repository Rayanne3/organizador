import { z } from "zod";

const MAX_IMAGE_BASE64_LENGTH = 7_000_000;

export const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  description: z.string().optional().nullable(),
  sku: z.string().min(3, "SKU muito curto"),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  stock: z.number().int("Quantidade deve ser um número inteiro").min(0, "Quantidade não pode ser negativa"),
  image: z
    .string()
    .refine((val) => !val || val.startsWith("data:image/"), "Imagem inválida")
    .refine((val) => !val || val.length <= MAX_IMAGE_BASE64_LENGTH, "Imagem muito grande (máx. ~5MB)")
    .optional()
    .nullable(),
});

export const updateProductSchema = productSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;