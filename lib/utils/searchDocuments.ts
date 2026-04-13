import { useAuthStore } from "@/lib/stores/authStore";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { Document, DocumentFilters } from "@/lib/types";

export interface SearchScopeFilters {
   fileTypes?: string[];
   owners?: string[];
   tags?: string[];
   blockchainVerified?: boolean;
   isEncrypted?: boolean;
   isFavorite?: boolean;
   sharedWithMe?: boolean;
   minSize?: number;
   maxSize?: number;
   dateFrom?: Date;
   dateTo?: Date;
}

export interface SearchResultMatch extends Document {
   score: number;
   highlights: {
      title?: string;
      description?: string;
      content?: string;
   };
}

const documentTypeMatches = (mimeType: string, fileTypes?: string[]) => {
   if (!fileTypes || fileTypes.length === 0) return true;

   const normalizedMimeType = mimeType.toLowerCase();
   return fileTypes.some((type) => {
      const normalizedType = type.toLowerCase();
      return (
         normalizedMimeType === normalizedType ||
         normalizedMimeType.startsWith(normalizedType.replace("/*", "/")) ||
         normalizedMimeType.includes(normalizedType)
      );
   });
};

const highlight = (text: string | undefined, query: string) => {
   if (!text || !query.trim()) return text;
   const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
   return text.replace(new RegExp(`(${escapedQuery})`, "ig"), "**$1**");
};

const scoreDocument = (document: Document, query: string) => {
   if (!query.trim()) return 0.5;

   const normalizedQuery = query.trim().toLowerCase();
   let score = 0;

   if (document.title.toLowerCase().includes(normalizedQuery)) score += 0.5;
   if ((document.description || "").toLowerCase().includes(normalizedQuery))
      score += 0.25;
   if (document.fileName.toLowerCase().includes(normalizedQuery)) score += 0.15;
   if (document.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)))
      score += 0.1;
   if (document.owner.name.toLowerCase().includes(normalizedQuery))
      score += 0.05;

   return Math.min(score || 0.05, 1);
};

export const searchDemoDocuments = (
   query: string,
   filters: SearchScopeFilters = {},
): SearchResultMatch[] => {
   const documents = useDocumentStore
      .getState()
      .documents.filter((document) => !document.isDeleted);
   const currentUser = useAuthStore.getState().user;
   const normalizedQuery = query.trim().toLowerCase();

   return documents
      .filter((document) => {
         if (!documentTypeMatches(document.mimeType, filters.fileTypes)) {
            return false;
         }
         if (
            filters.owners?.length &&
            !filters.owners.includes(document.ownerId)
         ) {
            return false;
         }
         if (filters.tags?.length) {
            const hasTag = filters.tags.every((tag) =>
               document.tags.some(
                  (documentTag) =>
                     documentTag.toLowerCase() === tag.toLowerCase(),
               ),
            );
            if (!hasTag) return false;
         }
         if (
            filters.blockchainVerified !== undefined &&
            document.blockchainVerified !== filters.blockchainVerified
         ) {
            return false;
         }
         if (
            filters.isEncrypted !== undefined &&
            document.isEncrypted !== filters.isEncrypted
         ) {
            return false;
         }
         if (
            filters.isFavorite !== undefined &&
            document.isFavorite !== filters.isFavorite
         ) {
            return false;
         }
         if (filters.sharedWithMe) {
            const isSharedWithCurrentUser =
               document.shareCount > 0 && document.ownerId !== currentUser?.id;
            if (!isSharedWithCurrentUser) return false;
         }
         if (
            filters.minSize !== undefined &&
            document.fileSize < filters.minSize
         ) {
            return false;
         }
         if (
            filters.maxSize !== undefined &&
            document.fileSize > filters.maxSize
         ) {
            return false;
         }
         if (
            filters.dateFrom &&
            new Date(document.createdAt) < filters.dateFrom
         ) {
            return false;
         }
         if (filters.dateTo && new Date(document.createdAt) > filters.dateTo) {
            return false;
         }

         if (!normalizedQuery) return true;

         return [
            document.title,
            document.description || "",
            document.fileName,
            document.owner.name,
            document.owner.email,
            document.tags.join(" "),
         ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
      })
      .map((document) => ({
         ...document,
         score: scoreDocument(document, query),
         highlights: {
            title: highlight(document.title, query),
            description: highlight(document.description, query),
         },
      }))
      .sort(
         (left, right) =>
            right.score - left.score ||
            new Date(right.updatedAt).getTime() -
               new Date(left.updatedAt).getTime(),
      );
};
