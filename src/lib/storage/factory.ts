import { ImageStorageProvider } from "./types";
import { CloudinaryStorageProvider } from "./providers/cloudinary";
import { MockStorageProvider } from "./providers/mock";

export class StorageFactory {
  private static instance: ImageStorageProvider;

  static getProvider(): ImageStorageProvider {
    if (this.instance) return this.instance;

    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      this.instance = new CloudinaryStorageProvider();
    } else {
      console.warn("Cloudinary credentials missing. Using Mock Storage.");
      this.instance = new MockStorageProvider();
    }
    
    return this.instance;
  }
}
