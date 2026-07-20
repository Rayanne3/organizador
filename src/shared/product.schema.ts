import { z } from "zod";

// Diminuído para 4MB para caber no limite da Vercel (4.5MB total da função)
const MAX_IMAGE_BASE64_LENGTH = 4_000_000; 

export const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  description: z.string().optional().nullable(),
  sku: z.string().min(3, "SKU muito curto"),
  price: z.number().min(0.01, "Preço de venda deve ser maior que zero"),
  costPrice: z.number().min(0, "Preço de custo não pode ser negativo"), // NOVO CAMPO
  categoryId: z.string().min(1, "Selecione uma categoria"),
  stock: z.number().int("Quantidade deve ser um número inteiro").min(0, "Quantidade não pode ser negativa"),
  image: z
    .string()
    .refine((val) => !val || val.startsWith("data:image/"), "Imagem inválida")
    .refine((val) => !val || val.length <= MAX_IMAGE_BASE64_LENGTH, "Imagem muito grande para a Vercel (máx. 4MB)")
    .optional()
    .nullable(),
});

export const updateProductSchema = productSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;