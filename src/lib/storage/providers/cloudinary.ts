import { v2 as cloudinary } from 'cloudinary';
import { ImageStorageProvider } from '../types';

export class CloudinaryStorageProvider implements ImageStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'bhaijan-kashmir/products' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        }
      ).end(buffer);
    });
  }

  async delete(url: string): Promise<void> {
    // Extract public_id from URL if possible, or just ignore if complexity is high
    // Cloudinary usually needs public_id, not full URL for deletion.
    // For prototype, we might skip deletion or implement rudimentary ID extraction.
    const regex = /\/v\d+\/([^/]+)\./;
    const match = url.match(regex);
    if (match && match[1]) {
       await cloudinary.uploader.destroy(match[1]);
    }
  }
}
