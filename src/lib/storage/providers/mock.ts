import { ImageStorageProvider } from '../types';

export class MockStorageProvider implements ImageStorageProvider {
  async upload(file: File): Promise<string> {
    console.log('[MockStorage] Uploading file:', file.name);
    // Return a dummy placeholder image
    return `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`;
  }

  async delete(url: string): Promise<void> {
    console.log('[MockStorage] Deleting file:', url);
  }
}
