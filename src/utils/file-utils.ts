/**
 * Comprime una imagen antes de convertirla a base64
 * @param file - Archivo de imagen a comprimir
 * @param maxWidth - Ancho máximo de la imagen (default: 1920px)
 * @param maxHeight - Alto máximo de la imagen (default: 1080px)
 * @param quality - Calidad de compresión JPEG (0-1, default: 0.8)
 * @returns Promise con el string base64 de la imagen comprimida
 */
export const compressAndConvertToBase64 = async (
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Crear canvas para redimensionar
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a base64 con compresión
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };

      img.onerror = () => reject(new Error("Error al cargar la imagen"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
};

/**
 * Convierte un archivo a base64 con compresión
 * @param file - Archivo a convertir
 * @returns Promise con el string base64
 */
export const fileToBase64 = async (file: File): Promise<string> => {
  // Si es una imagen, comprimir antes de convertir
  if (file.type.startsWith("image/")) {
    return compressAndConvertToBase64(file);
  }

  // Si no es imagen, convertir directamente
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
};

/**
 * Convierte un array de archivos a base64 con compresión
 * @param files - Array de archivos a convertir
 * @returns Promise con array de strings base64
 */
export const filesToBase64Array = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map((file) => fileToBase64(file)));
};
