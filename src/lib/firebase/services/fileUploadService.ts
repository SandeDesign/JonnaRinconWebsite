import { FileUploadRequest, FileUploadResponse } from '../types';

class FileUploadService {
  private phpProxyUrl: string = '';
  private apiKey: string = '';

  setProxyConfig(url: string, apiKey?: string): void {
    this.phpProxyUrl = url;
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    if (!this.phpProxyUrl) {
      throw new Error('PHP proxy URL not configured. Please set it in settings.');
    }

    try {
      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('type', request.type);

      if (request.folder) {
        formData.append('folder', request.folder);
      }

      const headers: HeadersInit = {};

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const response = await fetch(`${this.phpProxyUrl}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Upload failed with status ${response.status}`
        );
      }

      const data = await response.json();

      return {
        success: true,
        url: data.url,
        filename: data.filename,
        size: data.size,
      };
    } catch (error: any) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file',
      };
    }
  }

  async uploadMultiple(files: FileUploadRequest[]): Promise<FileUploadResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      console.error('Multiple file upload error:', error);
      throw new Error(error.message || 'Failed to upload files');
    }
  }

  async uploadAudio(file: File, folder?: string): Promise<FileUploadResponse> {
    return this.uploadFile({ file, type: 'audio', folder });
  }

  async uploadImage(file: File, folder?: string): Promise<FileUploadResponse> {
    return this.uploadFile({ file, type: 'image', folder });
  }

  async uploadDocument(file: File, folder?: string): Promise<FileUploadResponse> {
    return this.uploadFile({ file, type: 'document', folder });
  }

  async uploadVideo(file: File, folder?: string): Promise<FileUploadResponse> {
    return this.uploadFile({ file, type: 'video', folder });
  }

  async deleteFile(url: string): Promise<boolean> {
    if (!this.phpProxyUrl) {
      throw new Error('PHP proxy URL not configured');
    }

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const response = await fetch(`${this.phpProxyUrl}/delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.success || false;
    } catch (error: any) {
      console.error('File delete error:', error);
      throw new Error(error.message || 'Failed to delete file');
    }
  }

  validateFile(file: File, type: FileUploadRequest['type']): {
    valid: boolean;
    error?: string;
  } {
    const maxSizes = {
      audio: 50 * 1024 * 1024, // 50MB
      image: 10 * 1024 * 1024, // 10MB
      document: 20 * 1024 * 1024, // 20MB
      video: 100 * 1024 * 1024, // 100MB
    };

    const allowedTypes = {
      audio: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    };

    if (file.size > maxSizes[type]) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSizes[type] / (1024 * 1024)}MB`,
      };
    }

    if (!allowedTypes[type].includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed for ${type} uploads`,
      };
    }

    return { valid: true };
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  async generateThumbnail(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
}

export const fileUploadService = new FileUploadService();
