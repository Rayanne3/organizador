export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  color?: string | null;
  order?: number;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}