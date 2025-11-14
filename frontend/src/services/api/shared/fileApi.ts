import axios from 'axios';

const FILE_API_BASE = '/api/files';

const fileApi = axios.create({
  baseURL: FILE_API_BASE,
  timeout: 30000, // Longer timeout for file operations
});

export const fileApiService = {
  // Upload file
  upload: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fileApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Download file
  download: async (fileId: string, fileName: string) => {
    const response = await fileApi.get(`/download/${fileId}`, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // List files
  list: async (path?: string) => {
    const params = new URLSearchParams();
    if (path) params.append('path', path);
    
    const response = await fileApi.get(`/list?${params.toString()}`);
    return response.data;
  },

  // Delete file
  delete: async (fileId: string) => {
    const response = await fileApi.delete(`/delete/${fileId}`);
    return response.data;
  },

  // Get file info
  getInfo: async (fileId: string) => {
    const response = await fileApi.get(`/info/${fileId}`);
    return response.data;
  }
};

export default fileApiService;