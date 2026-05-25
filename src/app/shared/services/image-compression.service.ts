import { Injectable } from '@angular/core';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageCompressionService {

  constructor() { }

  /**
   * Comprime uma imagem mantendo a qualidade visual
   * @param file Arquivo de imagem original
   * @param options Opções de compressão
   * @returns Promise com o arquivo comprimido e informações de compressão
   */
  async compressImage(file: File, options: CompressionOptions = {}): Promise<CompressionResult> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      maxSizeKB = 500 // 500KB por padrão
    } = options;

    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        reject(new Error('Contexto 2D não disponível para compressão de imagem.'));
        return;
      }

      img.onload = async () => {
        try {
          const originalWidth = img.width;
          const originalHeight = img.height;
          let currentMaxWidth = maxWidth;
          let currentMaxHeight = maxHeight;
          let attempt = 0;
          const maxAttempts = 6;
          const sizeLimitBytes = maxSizeKB * 1024;
          let lastResult: CompressionResult | null = null;

          
          while (attempt < maxAttempts) {
            const { width, height } = this.calculateDimensions(
              originalWidth,
              originalHeight,
              currentMaxWidth,
              currentMaxHeight
            );

            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            
            lastResult = await this.compressWithQuality(canvas, file, quality, maxSizeKB);

            
            if (lastResult.compressedSize <= sizeLimitBytes || width <= 320 || height <= 320) {
                            resolve(lastResult);
              return;
            }

            currentMaxWidth = Math.max(Math.floor(currentMaxWidth * 0.85), 320);
            currentMaxHeight = Math.max(Math.floor(currentMaxHeight * 0.85), 320);
            attempt++;
          }

          if (lastResult) {
            console.warn('⚠️ Não foi possível atingir exatamente o limite desejado, retornando melhor resultado obtido.');
            resolve(lastResult);
            return;
          }

          reject(new Error('Não foi possível comprimir a imagem.'));
        } catch (error) {
          console.error('❌ Erro ao processar imagem:', error);
          reject(error);
        }
      };

      img.onerror = () => {
        console.error('❌ Erro ao carregar imagem');
        reject(new Error('Erro ao carregar a imagem'));
      };

      // Carregar imagem
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calcula as novas dimensões mantendo a proporção
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Redimensionar apenas se necessário
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;

      if (width > height) {
        width = Math.min(width, maxWidth);
        height = width / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      } else {
        height = Math.min(height, maxHeight);
        width = height * aspectRatio;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Comprime a imagem com diferentes qualidades até atingir o tamanho desejado
   */
  private async compressWithQuality(
    canvas: HTMLCanvasElement,
    originalFile: File,
    initialQuality: number,
    maxSizeKB: number
  ): Promise<CompressionResult> {
    const originalSize = originalFile.size;
    let quality = initialQuality;
    let compressedFile: File;
    let compressedSize: number;

    // Tentar diferentes qualidades
    const qualitySteps = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
    let currentStep = 0;

    do {
      // Converter canvas para blob
      const blob = await this.canvasToBlob(canvas, quality, originalFile.type);
      compressedFile = new File([blob], originalFile.name, {
        type: originalFile.type,
        lastModified: Date.now()
      });
      compressedSize = compressedFile.size;

      
      // Se atingiu o tamanho desejado, parar
      if (compressedSize <= maxSizeKB * 1024) {
        break;
      }

      // Usar próxima qualidade
      if (currentStep < qualitySteps.length - 1) {
        quality = qualitySteps[currentStep + 1];
        currentStep++;
      } else {
        // Se não conseguiu com as qualidades padrão, usar qualidade mínima
        quality = 0.1;
        break;
      }
    } while (compressedSize > maxSizeKB * 1024 && quality > 0.1);

    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio
    };
  }

  /**
   * Converte canvas para blob
   */
  private canvasToBlob(canvas: HTMLCanvasElement, quality: number, type: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Erro ao converter canvas para blob'));
          }
        },
        type,
        quality
      );
    });
  }

  /**
   * Valida se o arquivo é uma imagem válida
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Por favor, selecione apenas arquivos de imagem' };
    }

    // Verificar tamanho máximo (10MB)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { isValid: false, error: `A imagem deve ter no máximo ${maxSizeMB}MB` };
    }

    return { isValid: true };
  }

  /**
   * Cria preview da imagem comprimida
   */
  async createPreview(file: File, maxWidth: number = 300): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxWidth
        );

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const previewUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(previewUrl);
      };

      img.onerror = () => reject(new Error('Erro ao criar preview'));

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Método utilitário para formatar tamanho de arquivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
