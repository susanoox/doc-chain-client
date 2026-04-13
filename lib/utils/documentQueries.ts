import { Document, DocumentFilters, SortOption } from "@/lib/types";

const documentTypeMatches = (mimeType: string, types?: string[]) => {
   if (!types || types.length === 0) return true;

   const normalizedType = mimeType.toLowerCase();
   return types.some((type) => {
      switch (type) {
         case "pdf":
            return normalizedType === "application/pdf";
         case "doc":
            return (
               normalizedType === "application/msword" ||
               normalizedType.includes("wordprocessingml.document")
            );
         case "docx":
            return normalizedType.includes("wordprocessingml.document");
         case "txt":
            return normalizedType.startsWith("text/");
         case "image":
            return normalizedType.startsWith("image/");
         default:
            return normalizedType.includes(type);
      }
   });
};

const matchesSearchText = (document: Document, search?: string) => {
   if (!search) return true;

   const normalizedSearch = search.trim().toLowerCase();
   if (!normalizedSearch) return true;

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
      .includes(normalizedSearch);
};

export const filterDocuments = (
   documents: Document[],
   filters: DocumentFilters = {},
   options: { includeDeleted?: boolean } = {},
) => {
   return documents.filter((document) => {
      if (!options.includeDeleted && document.isDeleted) return false;
      if (!matchesSearchText(document, filters.search)) return false;
      if (!documentTypeMatches(document.mimeType, filters.type)) return false;
      if (filters.tags?.length) {
         const hasAllTags = filters.tags.every((tag) =>
            document.tags.some(
               (documentTag) => documentTag.toLowerCase() === tag.toLowerCase(),
            ),
         );
         if (!hasAllTags) return false;
      }
      if (filters.owner?.length) {
         const matchesOwner = filters.owner.includes(document.ownerId);
         if (!matchesOwner) return false;
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
      if (filters.dateFrom && new Date(document.createdAt) < filters.dateFrom) {
         return false;
      }
      if (filters.dateTo && new Date(document.createdAt) > filters.dateTo) {
         return false;
      }

      return true;
   });
};

const sortByName = (left: Document, right: Document, ascending = true) =>
   ascending
      ? left.title.localeCompare(right.title)
      : right.title.localeCompare(left.title);

export const sortDocuments = (documents: Document[], sortBy: SortOption) => {
   return [...documents].sort((left, right) => {
      switch (sortBy) {
         case "oldest":
            return (
               new Date(left.updatedAt).getTime() -
               new Date(right.updatedAt).getTime()
            );
         case "name-asc":
            return sortByName(left, right, true);
         case "name-desc":
            return sortByName(left, right, false);
         case "size-asc":
            return left.fileSize - right.fileSize;
         case "size-desc":
            return right.fileSize - left.fileSize;
         case "ai-suggested":
            return (
               Number(right.blockchainVerified) -
                  Number(left.blockchainVerified) ||
               right.shareCount - left.shareCount ||
               new Date(right.updatedAt).getTime() -
                  new Date(left.updatedAt).getTime()
            );
         case "recent":
         default:
            return (
               new Date(right.updatedAt).getTime() -
               new Date(left.updatedAt).getTime()
            );
      }
   });
};
