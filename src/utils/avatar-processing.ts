export const AVATAR_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const AVATAR_MAX_ORIGINAL_BYTES = 8 * 1024 * 1024;
export const AVATAR_MAX_SOURCE_PIXELS = 25_000_000;
export const AVATAR_MAX_SOURCE_DIMENSION = 8_000;
export const AVATAR_BASE_SIZE = 1_200;
export const AVATAR_MAX_PROCESSED_BYTES = 1024 * 1024;
export const AVATAR_JPEG_QUALITIES = [0.9, 0.85, 0.8] as const;

type AllowedAvatarType = (typeof AVATAR_ALLOWED_TYPES)[number];

export interface AvatarCropPlan {
  sourceX: number;
  sourceY: number;
  sourceSize: number;
  outputSize: number;
}

interface LoadedAvatarImage {
  source: CanvasImageSource;
  width: number;
  height: number;
}

interface AvatarProcessingDependencies {
  loadImage: (file: File) => Promise<LoadedAvatarImage>;
  createCanvas: () => HTMLCanvasElement;
}

const isAllowedAvatarType = (type: string): type is AllowedAvatarType =>
  AVATAR_ALLOWED_TYPES.includes(type as AllowedAvatarType);

export const validateAvatarFile = (file: File) => {
  if (!isAllowedAvatarType(file.type)) {
    throw new Error("Usá una imagen JPEG, PNG o WebP");
  }

  if (file.size > AVATAR_MAX_ORIGINAL_BYTES) {
    throw new Error("La imagen no puede superar los 8 MB");
  }
};

export const getAvatarCropPlan = (
  width: number,
  height: number,
): AvatarCropPlan => {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("No se pudieron leer las dimensiones de la imagen");
  }

  if (
    width > AVATAR_MAX_SOURCE_DIMENSION ||
    height > AVATAR_MAX_SOURCE_DIMENSION ||
    width * height > AVATAR_MAX_SOURCE_PIXELS
  ) {
    throw new Error("La imagen tiene dimensiones demasiado grandes");
  }

  const sourceSize = Math.min(width, height);

  return {
    sourceX: Math.floor((width - sourceSize) / 2),
    sourceY: Math.floor((height - sourceSize) / 2),
    sourceSize,
    outputSize: Math.min(AVATAR_BASE_SIZE, sourceSize),
  };
};

export const getDataUrlByteSize = (dataUrl: string) => {
  const payload = dataUrl.split(",", 2)[1];
  if (!payload) return 0;

  const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
  return Math.floor((payload.length * 3) / 4) - padding;
};

const loadAvatarImage = (file: File): Promise<LoadedAvatarImage> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen seleccionada"));
    };
    image.src = objectUrl;
  });

const defaultDependencies: AvatarProcessingDependencies = {
  loadImage: loadAvatarImage,
  createCanvas: () => document.createElement("canvas"),
};

export const processAvatarFile = async (
  file: File,
  dependencies: AvatarProcessingDependencies = defaultDependencies,
): Promise<string> => {
  validateAvatarFile(file);

  const image = await dependencies.loadImage(file);
  const crop = getAvatarCropPlan(image.width, image.height);
  const canvas = dependencies.createCanvas();
  canvas.width = crop.outputSize;
  canvas.height = crop.outputSize;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo procesar la imagen");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, crop.outputSize, crop.outputSize);
  context.drawImage(
    image.source,
    crop.sourceX,
    crop.sourceY,
    crop.sourceSize,
    crop.sourceSize,
    0,
    0,
    crop.outputSize,
    crop.outputSize,
  );

  for (const quality of AVATAR_JPEG_QUALITIES) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (getDataUrlByteSize(dataUrl) <= AVATAR_MAX_PROCESSED_BYTES) {
      return dataUrl;
    }
  }

  throw new Error("La imagen procesada sigue siendo demasiado pesada");
};
