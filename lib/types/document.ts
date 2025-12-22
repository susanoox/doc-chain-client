import { User } from "./user";

export interface Document {
   id: string;
   title: string;
   description?: string;
   fileName: string;
   fileSize: number;
   mimeType: string;
   ownerId: string;
   owner: User;
   tags: string[];
   blockchainHash?: string;
   blockchainVerified: boolean;
   isEncrypted: boolean;
   isFavorite: boolean;
   isDeleted: boolean;
   deletedAt?: Date;
   createdAt: Date;
   updatedAt: Date;
   version: number;
   shareCount: number;
   downloadUrl?: string;
   thumbnailUrl?: string;
}

export interface DocumentMetadata {
   title: string;
   description?: string;
   tags: string[];
   isEncrypted: boolean;
   shareWith?: string[];
}

export interface DocumentFilters {
   search?: string;
   type?: string[];
   tags?: string[];
   owner?: string[];
   dateFrom?: Date;
   dateTo?: Date;
   blockchainVerified?: boolean;
   isEncrypted?: boolean;
   isFavorite?: boolean;
}

export type SortOption =
   | "recent"
   | "oldest"
   | "name-asc"
   | "name-desc"
   | "size-asc"
   | "size-desc"
   | "ai-suggested";

export interface DocumentVersion {
   id: string;
   documentId: string;
   version: number;
   fileName: string;
   fileSize: number;
   blockchainHash?: string;
   createdBy: User;
   createdAt: Date;
   changes?: string;
}

export interface DocumentComment {
   id: string;
   documentId: string;
   userId: string;
   user: User;
   text: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface Share {
   id: string;
   documentId: string;
   sharedWith: User;
   permission: "view" | "edit";
   sharedBy: User;
   expiresAt?: Date;
   createdAt: Date;
}

export interface ShareLinkOptions {
   permission: "view" | "edit";
   expiresAt?: Date;
   password?: string;
   allowDownload: boolean;
   blockchainAudit: boolean;
}

export interface ShareLink {
   id: string;
   documentId: string;
   token: string;
   url: string;
   permission: "view" | "edit";
   expiresAt?: Date;
   createdBy: User;
   createdAt: Date;
   accessCount: number;
}
