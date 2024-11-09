export interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
  success: boolean;
  image?: GalleryImage;
  error?: string;
}