/**
 * Image Optimization & Compression Utility
 * Resizes large camera photos to crisp, web-optimized JPEG/WebP formats
 * reducing 5MB-15MB phone photos down to ~40KB-90KB for instant storage and fast loading.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKb?: number;
}

export interface CompressResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  fileName?: string;
}

export function isDataUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.startsWith('data:image/');
}

/**
 * Calculates approximate size in Kilobytes of a base64 Data URL
 */
export function getDataUrlSizeKb(dataUrl: string): number {
  if (!dataUrl) return 0;
  const base64Str = dataUrl.split(',')[1] || '';
  const bytes = (base64Str.length * 3) / 4;
  return Math.round((bytes / 1024) * 10) / 10;
}

/**
 * Compresses an image File or Blob to a lightweight Data URL.
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1000,
    quality = 0.78,
    maxSizeKb = 150,
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Create an object URL or FileReader
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        // Draw image with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // First pass export
        let outputQuality = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', outputQuality);
        let sizeKb = getDataUrlSizeKb(dataUrl);

        // Adaptive step: if still above maxSizeKb, reduce quality / scale slightly
        if (sizeKb > maxSizeKb) {
          outputQuality = Math.max(0.65, quality - 0.15);
          dataUrl = canvas.toDataURL('image/jpeg', outputQuality);
          sizeKb = getDataUrlSizeKb(dataUrl);
        }

        resolve({
          dataUrl,
          sizeKb,
          width,
          height,
          fileName: (file as File).name || 'image.jpg',
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = err => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('فشل تحميل الصورة ومعالجتها: ' + (err ? String(err) : '')));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a base64 image data URL directly to GitHub repository under uploads/
 * If successful, returns the relative repository path `./uploads/{filename}`.
 * If GitHub sync is not available or fails, returns null so the caller can keep the compressed dataUrl.
 */
export async function uploadImageToGitHub(
  dataUrl: string,
  fileName: string,
  githubToken: string,
  repo: string = 'almagdly/almagdly.github.io',
  branch: string = 'main'
): Promise<string | null> {
  if (!isDataUrl(dataUrl) || !githubToken) {
    return null;
  }

  try {
    const base64Content = dataUrl.split(',')[1];
    if (!base64Content) return null;

    const targets = [`docs/uploads/${fileName}`, `uploads/${fileName}`];
    let anySuccess = false;

    for (const filePath of targets) {
      try {
        // Check existing sha if it exists
        let sha: string | undefined;
        try {
          const checkRes = await fetch(
            `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
            {
              headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );
          if (checkRes.ok) {
            const data = await checkRes.json();
            sha = data.sha;
          }
        } catch {}

        const putRes = await fetch(
          `https://api.github.com/repos/${repo}/contents/${filePath}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${githubToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
              message: `upload image: ${filePath}`,
              content: base64Content,
              branch,
              ...(sha ? { sha } : {}),
            }),
          }
        );

        if (putRes.ok) {
          anySuccess = true;
        }
      } catch (e) {
        console.warn(`Failed to upload ${filePath}:`, e);
      }
    }

    if (anySuccess) {
      return `./uploads/${fileName}`;
    }
  } catch (err) {
    console.error('Error uploading image to GitHub:', err);
  }

  return null;
}
