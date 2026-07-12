export interface ImageUploadProps {
  value?: string | null; // base64 data URL atual
  onChange: (base64: string | null) => void;
  error?: string;
}