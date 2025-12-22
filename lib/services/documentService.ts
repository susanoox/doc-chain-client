import { apiClient } from './api';
import {
  Document,
  DocumentMetadata,
  DocumentFilters,
  PaginatedResponse,
  DocumentVersion,
  DocumentComment,
  Share,
  ShareLinkOptions,
  ShareLink,
  BlockchainVerification,
  AIDocumentSummary,
} from '@/lib/types';

export const documentService = {
  // List & Search
  getDocuments: async (filters?: DocumentFilters) => {
    return apiClient.get<PaginatedResponse<Document>>('/documents', {
      params: filters,
    });
  },

  getDocument: async (id: string) => {
    return apiClient.get<Document>(`/documents/${id}`);
  },

  // Upload & Update
  uploadDocument: async (file: File, metadata: DocumentMetadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return apiClient.post<Document>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateDocument: async (id: string, data: Partial<Document>) => {
    return apiClient.put<Document>(`/documents/${id}`, data);
  },

  deleteDocument: async (id: string) => {
    return apiClient.delete(`/documents/${id}`);
  },

  bulkDelete: async (ids: string[]) => {
    return apiClient.post('/documents/bulk-delete', { ids });
  },

  // Blockchain
  verifyBlockchain: async (id: string) => {
    return apiClient.post<BlockchainVerification>(`/documents/${id}/verify`);
  },

  // AI
  generateSummary: async (id: string) => {
    return apiClient.get<AIDocumentSummary>(`/documents/${id}/summary`);
  },

  getTagSuggestions: async (id: string) => {
    return apiClient.get<string[]>(`/documents/${id}/tag-suggestions`);
  },

  // Comments
  getComments: async (documentId: string) => {
    return apiClient.get<DocumentComment[]>(`/documents/${documentId}/comments`);
  },

  addComment: async (documentId: string, text: string) => {
    return apiClient.post<DocumentComment>(`/documents/${documentId}/comments`, {
      text,
    });
  },

  // Versions
  getVersions: async (documentId: string) => {
    return apiClient.get<DocumentVersion[]>(`/documents/${documentId}/versions`);
  },

  // Sharing
  shareDocument: async (
    documentId: string,
    userId: string,
    permission: 'view' | 'edit'
  ) => {
    return apiClient.post<Share>(`/documents/${documentId}/share`, {
      userId,
      permission,
    });
  },

  getShares: async (documentId: string) => {
    return apiClient.get<Share[]>(`/documents/${documentId}/shares`);
  },

  removeShare: async (shareId: string) => {
    return apiClient.delete(`/documents/shares/${shareId}`);
  },

  generateShareLink: async (documentId: string, options: ShareLinkOptions) => {
    return apiClient.post<ShareLink>(
      `/documents/${documentId}/share-link`,
      options
    );
  },

  // Favorites
  toggleFavorite: async (documentId: string, isFavorite: boolean) => {
    return isFavorite
      ? apiClient.delete(`/favorites/${documentId}`)
      : apiClient.post(`/favorites/${documentId}`);
  },
};
