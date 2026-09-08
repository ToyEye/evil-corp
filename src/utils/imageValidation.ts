export const COMPANY_ICON_MAX_BYTES = 512 * 1024;
export const COMPANY_ICON_MAX_PX = 512;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_MAX_PX = 1024;

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read the file"));
    };
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

const readFileAsArrayBuffer = (file: File) =>
  new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read the file"));
    };
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsArrayBuffer(file);
  });

const getImageSize = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("The file is not a valid image"));
    image.src = src;
  });

const hasPngSignature = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer).slice(0, PNG_SIGNATURE.length);
  return PNG_SIGNATURE.every((value, index) => bytes[index] === value);
};

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${bytes / (1024 * 1024)} MB`;
  }

  return `${Math.round(bytes / 1024)} KB`;
};

export const validatePngIcon = async (file: File) => {
  if (file.type !== "image/png" || !file.name.toLowerCase().endsWith(".png")) {
    throw new Error("Company icon must be a PNG file");
  }

  if (file.size > COMPANY_ICON_MAX_BYTES) {
    throw new Error(`Company icon must be ${formatBytes(COMPANY_ICON_MAX_BYTES)} or smaller`);
  }

  const [buffer, dataUrl] = await Promise.all([
    readFileAsArrayBuffer(file),
    readFileAsDataUrl(file),
  ]);

  if (!hasPngSignature(buffer)) {
    throw new Error("Company icon must be a valid PNG file");
  }

  const { width, height } = await getImageSize(dataUrl);

  if (width > COMPANY_ICON_MAX_PX || height > COMPANY_ICON_MAX_PX) {
    throw new Error(
      `Company icon must be ${COMPANY_ICON_MAX_PX}×${COMPANY_ICON_MAX_PX}px or smaller`,
    );
  }

  return dataUrl;
};

const AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export const validateAvatarImage = async (file: File) => {
  if (!AVATAR_TYPES.has(file.type)) {
    throw new Error("Avatar must be a PNG, JPG, or WebP image");
  }

  if (file.size > AVATAR_MAX_BYTES) {
    throw new Error(`Avatar must be ${formatBytes(AVATAR_MAX_BYTES)} or smaller`);
  }

  const dataUrl = await readFileAsDataUrl(file);
  const { width, height } = await getImageSize(dataUrl);

  if (width > AVATAR_MAX_PX || height > AVATAR_MAX_PX) {
    throw new Error(`Avatar must be ${AVATAR_MAX_PX}×${AVATAR_MAX_PX}px or smaller`);
  }

  return dataUrl;
};
