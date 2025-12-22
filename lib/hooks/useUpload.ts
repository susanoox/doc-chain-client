import { useState, useCallback } from 'react';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export const useUpload = () => {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
    error: null,
  });

  const upload = useCallback(
    async (
      file: File,
      url: string,
      onProgress?: (progress: number) => void
    ) => {
      setUploadState({ progress: 0, isUploading: true, error: null });

      try {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded * 100) / event.total);
              setUploadState((prev) => ({ ...prev, progress }));
              onProgress?.(progress);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadState({ progress: 100, isUploading: false, error: null });
              resolve(JSON.parse(xhr.responseText));
            } else {
              const error = 'Upload failed';
              setUploadState({ progress: 0, isUploading: false, error });
              reject(new Error(error));
            }
          });

          xhr.addEventListener('error', () => {
            const error = 'Upload failed';
            setUploadState({ progress: 0, isUploading: false, error });
            reject(new Error(error));
          });

          xhr.open('POST', url);
          xhr.send(formData);
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setUploadState({ progress: 0, isUploading: false, error: errorMessage });
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setUploadState({ progress: 0, isUploading: false, error: null });
  }, []);

  return {
    ...uploadState,
    upload,
    reset,
  };
};
