'use client';

import React, { useCallback, useRef, useState } from 'react';
import { ImageUploadProps } from './ImageUpload.types';

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

// Redimensiona e comprime a imagem no navegador antes de virar base64
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Não foi possível processar a imagem'));

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.onerror = () => reject(new Error('Arquivo de imagem inválido'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setLocalError(null);

      if (!file.type.startsWith('image/')) {
        setLocalError('Selecione um arquivo de imagem (JPG, PNG, WEBP).');
        return;
      }

      setIsProcessing(true);
      try {
        const compressed = await compressImage(file);
        onChange(compressed);
      } catch (err: any) {
        setLocalError(err.message || 'Erro ao processar imagem.');
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const displayError = error || localError;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[var(--color-ink-700)]">
        Foto do produto
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative group w-full max-w-xs">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border"
            style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-soft)' }}
          >
            <img src={value} alt="Prévia do produto" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-white/95 text-xs font-semibold text-[var(--color-ink-900)] shadow hover:bg-white transition-colors"
              >
                Trocar foto
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="px-4 py-2 rounded-full bg-white/95 text-xs font-semibold text-[var(--color-danger)] shadow hover:bg-white transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 w-full max-w-xs aspect-square rounded-[var(--radius-md)] border-2 border-dashed cursor-pointer transition-all
            ${isDragging
              ? 'border-[var(--color-gold-500)] bg-[var(--color-gold-100)]'
              : 'border-[var(--color-cream-300)] bg-[var(--color-cream-100)] hover:border-[var(--color-gold-400)] hover:bg-[var(--color-gold-100)]'
            }`}
        >
          {isProcessing ? (
            <>
              <div className="w-6 h-6 border-2 border-[var(--color-gold-500)] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-[var(--color-ink-500)]">Processando...</span>
            </>
          ) : (
            <>
              <svg
                width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-gold-500)" strokeWidth="1.5"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-semibold text-[var(--color-ink-700)] text-center px-4">
                Toque para escolher uma foto
              </span>
              <span className="text-[10px] text-[var(--color-ink-300)]">
                da câmera, galeria ou arquivos
              </span>
            </>
          )}
        </div>
      )}

      {displayError && (
        <span className="text-xs font-semibold text-[var(--color-danger)]">{displayError}</span>
      )}
    </div>
  );
};