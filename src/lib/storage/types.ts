export interface ImageStorageProvider {
  /**
   * Uploads a file buffer and returns the public URL.
   */
  upload(file: File): Promise<string>;

  /**
   * Deletes a file by its public URL or ID.
   */
  delete(url: string): Promise<void>;
}
