import api from './api';

export const uploadService = {
  // Upload single file
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  // Upload multiple files
  uploadFiles: async (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  // Delete file
  deleteFile: async (fileUrl) => {
    const response = await api.delete('/upload/delete', {
      data: { fileUrl }
    });
    return response.data;
  },

  // Get file info
  getFileInfo: async (fileUrl) => {
    const response = await api.get(`/upload/info?url=${encodeURIComponent(fileUrl)}`);
    return response.data;
  },

  // Generate signed URL for direct upload
  getSignedUrl: async (fileName, fileType) => {
    const response = await api.post('/upload/signed-url', {
      fileName,
      fileType
    });
    return response.data;
  }
};

export default uploadService;
