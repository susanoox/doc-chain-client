import { create } from "zustand";
import {
   Document,
   DocumentFilters,
   SortOption,
   DocumentMetadata,
   DocumentVersion,
   DocumentComment,
   Share,
   ShareLinkOptions,
   ShareLink,
} from "@/lib/types";
import { User } from "@/lib/types/user";
import {
   addDemoComment,
   addDemoShare,
   createDemoAISummary,
   createDemoBlockchainVerification,
   createDemoShareLink,
   demoDocuments,
   demoUsers,
   getDemoComments,
   getDemoDocument,
   getDemoShares,
   getDemoVersions,
   removeDemoShare,
} from "@/lib/mocks/demoData";
import { filterDocuments, sortDocuments } from "@/lib/utils/documentQueries";

interface DocumentState {
   // Documents list
   documents: Document[];
   currentDocument: Document | null;
   filters: DocumentFilters;
   sortBy: SortOption;
   viewMode: "grid" | "list";
   selectedDocuments: string[];

   // Loading states
   isLoading: boolean;
   isUploading: boolean;
   uploadProgress: number;
   isVerifying: boolean;

   // Document details
   aiSummary: string | null;
   comments: DocumentComment[];
   versions: DocumentVersion[];
   shares: Share[];

   // Error
   error: string | null;

   // Actions - List
   fetchDocuments: (filters?: DocumentFilters) => Promise<void>;
   setFilters: (filters: DocumentFilters) => void;
   setSortBy: (sortBy: SortOption) => void;
   setViewMode: (mode: "grid" | "list") => void;
   toggleSelectDocument: (id: string) => void;
   selectAll: () => void;
   clearSelection: () => void;

   // Actions - Upload
   uploadDocument: (file: File, metadata: DocumentMetadata) => Promise<void>;

   // Actions - Single document
   fetchDocument: (id: string) => Promise<void>;
   updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
   deleteDocument: (id: string) => Promise<void>;
   deleteMultiple: (ids: string[]) => Promise<void>;

   // Actions - Trash management
   restoreDocument: (id: string) => Promise<void>;
   permanentlyDeleteDocument: (id: string) => Promise<void>;

   // Actions - Blockchain
   verifyBlockchain: (id: string) => Promise<void>;

   // Actions - AI
   generateAISummary: (id: string) => Promise<void>;

   // Actions - Comments
   addComment: (documentId: string, text: string) => Promise<void>;
   fetchComments: (documentId: string) => Promise<void>;

   // Actions - Versions
   fetchVersions: (documentId: string) => Promise<void>;

   // Actions - Sharing
   shareDocument: (
      documentId: string,
      userId: string,
      permission: "view" | "edit" | "admin",
   ) => Promise<void>;
   removeShare: (shareId: string) => Promise<void>;
   generateShareLink: (
      documentId: string,
      options: ShareLinkOptions,
   ) => Promise<ShareLink>;
   fetchShares: (documentId: string) => Promise<void>;

   // Actions - Favorites
   toggleFavorite: (documentId: string) => Promise<void>;

   // Utility
   clearError: () => void;
   reset: () => void;
}

const initialFilters: DocumentFilters = {
   search: "",
   type: [],
   tags: [],
   owner: [],
};

export const useDocumentStore = create<DocumentState>((set, get) => ({
   documents: demoDocuments,
   currentDocument: null,
   filters: initialFilters,
   sortBy: "recent",
   viewMode: "grid",
   selectedDocuments: [],
   isLoading: false,
   isUploading: false,
   uploadProgress: 0,
   isVerifying: false,
   aiSummary: null,
   comments: [],
   versions: [],
   shares: [],
   error: null,

   fetchDocuments: async (filters) => {
      set({ isLoading: true, error: null });
      try {
         const currentFilters = filters || get().filters;
         const sortBy = get().sortBy;

         const filteredDocuments = filterDocuments(
            demoDocuments,
            currentFilters,
            {
               includeDeleted: true,
            },
         );
         const sortedDocuments = sortDocuments(filteredDocuments, sortBy);

         set({ documents: sortedDocuments, isLoading: false });
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch documents",
            isLoading: false,
         });
      }
   },

   setFilters: (filters) => {
      set({ filters });
      get().fetchDocuments(filters);
   },

   setSortBy: (sortBy) => {
      set({ sortBy });
      get().fetchDocuments();
   },

   setViewMode: (mode) => set({ viewMode: mode }),

   toggleSelectDocument: (id) =>
      set((state) => {
         const isSelected = state.selectedDocuments.includes(id);
         return {
            selectedDocuments: isSelected
               ? state.selectedDocuments.filter((docId) => docId !== id)
               : [...state.selectedDocuments, id],
         };
      }),

   selectAll: () =>
      set((state) => ({
         selectedDocuments: state.documents.map((doc) => doc.id),
      })),

   clearSelection: () => set({ selectedDocuments: [] }),

   uploadDocument: async (file, metadata) => {
      set({ isUploading: true, uploadProgress: 0, error: null });
      try {
         const document: Document = {
            id: `doc-${Date.now()}`,
            title: metadata.title,
            description: metadata.description,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || "application/octet-stream",
            ownerId: demoUsers[0].id,
            owner: demoUsers[0],
            tags: metadata.tags,
            blockchainVerified: false,
            isEncrypted: metadata.isEncrypted,
            isFavorite: false,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            shareCount: 0,
         };

         demoDocuments.unshift(document);

         set((state) => ({
            documents: [document, ...state.documents],
            isUploading: false,
            uploadProgress: 100,
         }));
      } catch (error) {
         set({
            error: error instanceof Error ? error.message : "Upload failed",
            isUploading: false,
            uploadProgress: 0,
         });
         throw error;
      }
   },

   fetchDocument: async (id) => {
      set({ isLoading: true, error: null });
      try {
         const document = getDemoDocument(id);

         if (!document) {
            throw new Error("Failed to fetch document");
         }

         set({
            currentDocument: document,
            comments: getDemoComments(id),
            versions: getDemoVersions(id),
            shares: getDemoShares(id),
            aiSummary: createDemoAISummary(document).summary,
            isLoading: false,
         });
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch document",
            isLoading: false,
         });
      }
   },

   updateDocument: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
         const existingDocument = getDemoDocument(id);

         if (!existingDocument) {
            throw new Error("Failed to update document");
         }

         const updatedDocument: Document = {
            ...existingDocument,
            ...data,
            updatedAt: new Date(),
         };

         const documentIndex = demoDocuments.findIndex((doc) => doc.id === id);
         if (documentIndex >= 0) {
            demoDocuments[documentIndex] = updatedDocument;
         }

         set((state) => ({
            documents: state.documents.map((doc) =>
               doc.id === id ? updatedDocument : doc,
            ),
            currentDocument:
               state.currentDocument?.id === id
                  ? updatedDocument
                  : state.currentDocument,
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to update document",
            isLoading: false,
         });
         throw error;
      }
   },

   deleteDocument: async (id) => {
      set({ isLoading: true, error: null });
      try {
         const document = demoDocuments.find((doc) => doc.id === id);
         if (document) {
            document.isDeleted = true;
            document.deletedAt = new Date();
            document.updatedAt = new Date();
         }

         set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== id),
            selectedDocuments: state.selectedDocuments.filter(
               (docId) => docId !== id,
            ),
            currentDocument:
               state.currentDocument?.id === id ? null : state.currentDocument,
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to delete document",
            isLoading: false,
         });
         throw error;
      }
   },

   deleteMultiple: async (ids) => {
      set({ isLoading: true, error: null });
      try {
         demoDocuments.forEach((document) => {
            if (ids.includes(document.id)) {
               document.isDeleted = true;
               document.deletedAt = new Date();
               document.updatedAt = new Date();
            }
         });

         set((state) => ({
            documents: state.documents.filter((doc) => !ids.includes(doc.id)),
            selectedDocuments: [],
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to delete documents",
            isLoading: false,
         });
         throw error;
      }
   },

   verifyBlockchain: async (id) => {
      set({ isVerifying: true, error: null });
      try {
         const document = getDemoDocument(id);

         if (!document) {
            throw new Error("Verification failed");
         }

         const verification = createDemoBlockchainVerification(document, true);
         set({ isVerifying: false });

         const documentIndex = demoDocuments.findIndex((doc) => doc.id === id);
         if (documentIndex >= 0) {
            demoDocuments[documentIndex] = {
               ...demoDocuments[documentIndex],
               blockchainVerified: verification.verified,
            };
         }

         // Update document with verification status
         set((state) => ({
            documents: state.documents.map((doc) =>
               doc.id === id
                  ? { ...doc, blockchainVerified: verification.verified }
                  : doc,
            ),
            currentDocument:
               state.currentDocument?.id === id
                  ? {
                       ...state.currentDocument,
                       blockchainVerified: verification.verified,
                    }
                  : state.currentDocument,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error ? error.message : "Verification failed",
            isVerifying: false,
         });
         throw error;
      }
   },

   generateAISummary: async (id) => {
      set({ isLoading: true, error: null });
      try {
         const document = getDemoDocument(id);

         if (!document) {
            throw new Error("Failed to generate summary");
         }

         const summary = createDemoAISummary(document);
         set({ aiSummary: summary.summary, isLoading: false });
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to generate summary",
            isLoading: false,
         });
      }
   },

   addComment: async (documentId, text) => {
      set({ isLoading: true, error: null });
      try {
         const comment = addDemoComment(documentId, text);
         const document = demoDocuments.find(
            (entry) => entry.id === documentId,
         );
         if (document) {
            document.updatedAt = new Date();
         }

         set((state) => ({
            comments: [...state.comments, comment],
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error ? error.message : "Failed to add comment",
            isLoading: false,
         });
         throw error;
      }
   },

   fetchComments: async (documentId) => {
      try {
         const comments = getDemoComments(documentId);
         set({ comments });
      } catch (error) {
         console.error("Failed to fetch comments:", error);
      }
   },

   fetchVersions: async (documentId) => {
      try {
         const versions = getDemoVersions(documentId);
         set({ versions });
      } catch (error) {
         console.error("Failed to fetch versions:", error);
      }
   },

   shareDocument: async (documentId, userId, permission) => {
      set({ isLoading: true, error: null });
      try {
         const sharedWith = demoUsers.find((user) => user.id === userId);

         if (!sharedWith) {
            throw new Error("Failed to share document");
         }

         const share = addDemoShare(
            documentId,
            sharedWith,
            permission === "admin" ? "edit" : permission,
         );

         const document = demoDocuments.find(
            (entry) => entry.id === documentId,
         );
         if (document) {
            document.shareCount += 1;
            document.updatedAt = new Date();
         }

         set((state) => ({
            shares: [...state.shares, share],
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to share document",
            isLoading: false,
         });
         throw error;
      }
   },

   removeShare: async (shareId) => {
      set({ isLoading: true, error: null });
      try {
         const matchingShare = getDemoShares(
            get().currentDocument?.id || "",
         ).find((entry) => entry.id === shareId);
         if (matchingShare) {
            const document = demoDocuments.find(
               (entry) => entry.id === matchingShare.documentId,
            );
            if (document && document.shareCount > 0) {
               document.shareCount -= 1;
               document.updatedAt = new Date();
            }
         }

         removeDemoShare(shareId);

         set((state) => ({
            shares: state.shares.filter((share) => share.id !== shareId),
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to remove share",
            isLoading: false,
         });
         throw error;
      }
   },

   generateShareLink: async (documentId, options) => {
      set({ isLoading: true, error: null });
      try {
         const document = getDemoDocument(documentId);

         if (!document) {
            throw new Error("Failed to generate share link");
         }

         const shareLink = createDemoShareLink(documentId, options);
         set({ isLoading: false });
         return shareLink;
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to generate share link",
            isLoading: false,
         });
         throw error;
      }
   },

   fetchShares: async (documentId) => {
      try {
         const shares = getDemoShares(documentId);
         set({ shares });
      } catch (error) {
         console.error("Failed to fetch shares:", error);
      }
   },

   toggleFavorite: async (documentId) => {
      set({ isLoading: true, error: null });
      try {
         const document = get().documents.find((doc) => doc.id === documentId);
         const isFavorite = document?.isFavorite;

         const demoDocument = demoDocuments.find(
            (entry) => entry.id === documentId,
         );
         if (demoDocument) {
            demoDocument.isFavorite = !isFavorite;
            demoDocument.updatedAt = new Date();
         }

         set((state) => ({
            documents: state.documents.map((doc) =>
               doc.id === documentId
                  ? { ...doc, isFavorite: !isFavorite }
                  : doc,
            ),
            currentDocument:
               state.currentDocument?.id === documentId
                  ? { ...state.currentDocument, isFavorite: !isFavorite }
                  : state.currentDocument,
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to toggle favorite",
            isLoading: false,
         });
         throw error;
      }
   },

   restoreDocument: async (documentId) => {
      set({ isLoading: true, error: null });
      try {
         const document = demoDocuments.find(
            (entry) => entry.id === documentId,
         );
         if (document) {
            document.isDeleted = false;
            delete document.deletedAt;
            document.updatedAt = new Date();
         }

         set((state) => ({
            documents: state.documents.map((doc) =>
               doc.id === documentId
                  ? { ...doc, isDeleted: false, deletedAt: undefined }
                  : doc,
            ),
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to restore document",
            isLoading: false,
         });
         throw error;
      }
   },

   permanentlyDeleteDocument: async (documentId) => {
      set({ isLoading: true, error: null });
      try {
         const documentIndex = demoDocuments.findIndex(
            (entry) => entry.id === documentId,
         );
         if (documentIndex >= 0) {
            demoDocuments.splice(documentIndex, 1);
         }

         set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== documentId),
            selectedDocuments: state.selectedDocuments.filter(
               (id) => id !== documentId,
            ),
            currentDocument:
               state.currentDocument?.id === documentId
                  ? null
                  : state.currentDocument,
            shares: state.shares.filter(
               (share) => share.documentId !== documentId,
            ),
            comments: state.comments.filter(
               (comment) => comment.documentId !== documentId,
            ),
            versions: state.versions.filter(
               (version) => version.documentId !== documentId,
            ),
            isLoading: false,
         }));
      } catch (error) {
         set({
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to permanently delete document",
            isLoading: false,
         });
         throw error;
      }
   },

   clearError: () => set({ error: null }),

   reset: () =>
      set({
         documents: demoDocuments,
         currentDocument: null,
         filters: initialFilters,
         sortBy: "recent",
         selectedDocuments: [],
         aiSummary: null,
         comments: [],
         versions: [],
         shares: [],
         error: null,
      }),
}));
