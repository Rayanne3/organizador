export interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CATEGORY_COLOR_PALETTE = [
  { name: 'Dourado', value: '#a1906d' },
  { name: 'Terracota', value: '#b5674f' },
  { name: 'Sálvia', value: '#7a8c6e' },
  { name: 'Azul-acinzentado', value: '#5f7a8a' },
  { name: 'Ameixa', value: '#8a5f7a' },
  { name: 'Ardósia', value: '#5c5f66' },
  { name: 'Ferrugem', value: '#a3554a' },
  { name: 'Oliva', value: '#7d7a4a' },
] as const;