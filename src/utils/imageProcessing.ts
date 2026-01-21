export async function blurImage(file: File, blurAmount: number = 20): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Impossible de créer le contexte canvas'));
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Impossible de créer le blob'));
        }
      }, file.type);
    };

    img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
}

export async function addBlurOverlay(
  file: File,
  regions: { x: number; y: number; width: number; height: number }[]
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Impossible de créer le contexte canvas'));
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      regions.forEach(region => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) return;

        tempCanvas.width = region.width;
        tempCanvas.height = region.height;

        tempCtx.drawImage(
          img,
          region.x, region.y, region.width, region.height,
          0, 0, region.width, region.height
        );

        tempCtx.filter = 'blur(15px)';
        tempCtx.drawImage(tempCanvas, 0, 0);

        ctx.drawImage(tempCanvas, region.x, region.y);
      });

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Impossible de créer le blob'));
        }
      }, file.type);
    };

    img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
}

export function compressImage(file: File, maxSizeMB: number = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Impossible de créer le contexte canvas'));
      return;
    }

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      const maxWidth = 1920;
      const maxHeight = 1080;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const quality = Math.min(1, (maxSizeMB * 1024 * 1024) / file.size);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Impossible de créer le blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WEBP.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image trop volumineuse. Maximum 10 MB.'
    };
  }

  return { valid: true };
}

export async function processDocumentImage(file: File, applyBlur: boolean = true): Promise<Blob> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  let processedBlob: Blob = file;

  if (applyBlur) {
    processedBlob = await blurImage(file, 25);
  }

  if (file.size > 2 * 1024 * 1024) {
    processedBlob = await compressImage(file, 2);
  }

  return processedBlob;
}
