import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(40, "Nome muito longo"),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Cor inválida")
    .optional()
    .nullable(),
  order: z.number().int().optional(),
});

export const updateCategorySchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// Gera um slug simples e único a partir do nome (usado internamente pelo backend)
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}