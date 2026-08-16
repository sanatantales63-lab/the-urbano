/**
 * Utility for automatic client-side image compression and Cloudinary upload.
 * Cloud Name: suabdqxg
 * Upload Preset: the-urbano
 */

export const CLOUDINARY_CLOUD_NAME = "suabdqxg";
export const CLOUDINARY_PRESET = "the-urbano";

/**
 * Compresses an image file in the browser if it exceeds max size,
 * then uploads it directly to Cloudinary.
 */
export async function compressAndUploadToCloudinary(
  file: File,
  maxSizeMB = 0.5,
  maxWidthOrHeight = 1920
): Promise<string> {
  const res = await compressAndUploadDetailed(file, maxSizeMB, maxWidthOrHeight);
  return res.url;
}

export interface UploadResult {
  url: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  didCompress: boolean;
}

/**
 * Compresses an image file in the browser if it exceeds max size,
 * uploads it to Cloudinary, and returns detailed compression statistics.
 */
export async function compressAndUploadDetailed(
  file: File,
  maxSizeMB = 0.5,
  maxWidthOrHeight = 1920
): Promise<UploadResult> {
  const originalSizeKB = Math.round(file.size / 1024);
  let blobToUpload: Blob = file;
  let didCompress = false;

  try {
    if (file.type.startsWith("image/") && file.size > maxSizeMB * 1024 * 1024) {
      console.log(`[Cloudinary] File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds ${maxSizeMB}MB. Compressing...`);
      blobToUpload = await compressImageFile(file, maxWidthOrHeight, 0.85);
      didCompress = true;
      console.log(`[Cloudinary] Compressed size: ${(blobToUpload.size / 1024 / 1024).toFixed(2)}MB`);
    }
  } catch (err) {
    console.warn("[Cloudinary] Image compression failed, proceeding with original file:", err);
  }

  const compressedSizeKB = Math.round(blobToUpload.size / 1024);

  const formData = new FormData();
  formData.append("file", blobToUpload, file.name.replace(/\.[^/.]+$/, "") + ".webp");
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Cloudinary upload failed.");
  }

  return {
    url: result.secure_url,
    originalSizeKB,
    compressedSizeKB,
    didCompress
  };
}

/**
 * Resizes and compresses an image using HTML5 Canvas
 */
function compressImageFile(
  file: File,
  maxDimension: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context unavailable"));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with given quality (fallback to JPEG)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas blob conversion failed"));
          },
          "image/webp",
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
