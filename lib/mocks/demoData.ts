import { User } from "@/lib/types/user";
import {
   AIDocumentSummary,
   BlockchainVerification,
   Document,
   DocumentComment,
   DocumentVersion,
   Share,
   ShareLink,
   ShareLinkOptions,
} from "@/lib/types";

export const demoUsers: User[] = [
   {
      id: "user-1",
      email: "admin@docchain.com",
      name: "Admin User",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      bio: "System Administrator",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      mfaEnabled: true,
      isActive: true,
   },
   {
      id: "user-2",
      email: "john@docchain.com",
      name: "John Doe",
      role: "editor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      bio: "Senior Editor",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      mfaEnabled: false,
      isActive: true,
   },
   {
      id: "user-3",
      email: "user@docchain.com",
      name: "Jane Smith",
      role: "viewer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      bio: "Document Viewer",
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
      mfaEnabled: false,
      isActive: true,
   },
   {
      id: "user-4",
      email: "maria@docchain.com",
      name: "Maria Garcia",
      role: "editor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      bio: "Collaboration Lead",
      createdAt: new Date("2024-03-12"),
      updatedAt: new Date("2024-03-12"),
      mfaEnabled: false,
      isActive: true,
   },
   {
      id: "user-5",
      email: "david@docchain.com",
      name: "David Kim",
      role: "viewer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      bio: "Compliance Reviewer",
      createdAt: new Date("2024-04-05"),
      updatedAt: new Date("2024-04-05"),
      mfaEnabled: false,
      isActive: true,
   },
   {
      id: "user-6",
      email: "sophia@docchain.com",
      name: "Sophia Chen",
      role: "editor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      bio: "Operations Manager",
      createdAt: new Date("2024-04-20"),
      updatedAt: new Date("2024-04-20"),
      mfaEnabled: false,
      isActive: true,
   },
];

export const demoAuthCredentials = {
   admin: {
      email: "admin@docchain.com",
      password: "admin123",
      user: demoUsers[0],
   },
   user: {
      email: "user@docchain.com",
      password: "user123",
      user: demoUsers[2],
   },
} as const;

export const demoDocuments: Document[] = [
   {
      id: "doc-1",
      title: "Project Proposal 2025",
      description:
         "Comprehensive project proposal for Q1 2025 blockchain integration initiative",
      fileName: "project-proposal-2025.pdf",
      fileSize: 2457600,
      mimeType: "application/pdf",
      ownerId: "user-1",
      owner: demoUsers[0],
      tags: ["proposal", "blockchain", "Q1-2025"],
      blockchainHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      blockchainVerified: true,
      isEncrypted: true,
      isFavorite: true,
      isDeleted: false,
      createdAt: new Date("2024-12-01"),
      updatedAt: new Date("2024-12-15"),
      version: 3,
      shareCount: 3,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/4f46e5/ffffff?text=Project+Proposal",
   },
   {
      id: "doc-2",
      title: "Smart Contract Specifications",
      description:
         "Technical specifications for document verification smart contracts",
      fileName: "smart-contract-specs.docx",
      fileSize: 1048576,
      mimeType:
         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ownerId: "user-2",
      owner: demoUsers[1],
      tags: ["smart-contract", "technical", "blockchain"],
      blockchainHash: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      blockchainVerified: true,
      isEncrypted: false,
      isFavorite: false,
      isDeleted: false,
      createdAt: new Date("2024-11-15"),
      updatedAt: new Date("2024-12-10"),
      version: 5,
      shareCount: 2,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/10b981/ffffff?text=Smart+Contracts",
   },
   {
      id: "doc-3",
      title: "User Guide - Document Chain",
      description: "Complete user guide for the Document Chain platform",
      fileName: "user-guide.pdf",
      fileSize: 5242880,
      mimeType: "application/pdf",
      ownerId: "user-1",
      owner: demoUsers[0],
      tags: ["documentation", "user-guide", "help"],
      blockchainVerified: false,
      isEncrypted: false,
      isFavorite: true,
      isDeleted: false,
      createdAt: new Date("2024-10-20"),
      updatedAt: new Date("2024-12-18"),
      version: 12,
      shareCount: 4,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/f59e0b/ffffff?text=User+Guide",
   },
   {
      id: "doc-4",
      title: "Q4 Financial Report",
      description: "Financial performance report for Q4 2024",
      fileName: "q4-financial-report.xlsx",
      fileSize: 3145728,
      mimeType:
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ownerId: "user-2",
      owner: demoUsers[1],
      tags: ["finance", "report", "Q4-2024"],
      blockchainHash: "0x4e83362442B8d1beC281594CEA3050c8EB01311C",
      blockchainVerified: true,
      isEncrypted: true,
      isFavorite: false,
      isDeleted: false,
      createdAt: new Date("2024-12-20"),
      updatedAt: new Date("2024-12-20"),
      version: 1,
      shareCount: 1,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/06b6d4/ffffff?text=Financial+Report",
   },
   {
      id: "doc-5",
      title: "API Documentation v2.0",
      description:
         "REST API documentation for Document Chain platform version 2.0",
      fileName: "api-docs-v2.pdf",
      fileSize: 1572864,
      mimeType: "application/pdf",
      ownerId: "user-3",
      owner: demoUsers[2],
      tags: ["api", "documentation", "technical"],
      blockchainHash: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      blockchainVerified: true,
      isEncrypted: false,
      isFavorite: true,
      isDeleted: false,
      createdAt: new Date("2024-11-01"),
      updatedAt: new Date("2024-12-05"),
      version: 7,
      shareCount: 3,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=API+Docs",
   },
   {
      id: "doc-6",
      title: "Security Audit Report",
      description: "Comprehensive security audit findings and recommendations",
      fileName: "security-audit-2024.pdf",
      fileSize: 4194304,
      mimeType: "application/pdf",
      ownerId: "user-1",
      owner: demoUsers[0],
      tags: ["security", "audit", "confidential"],
      blockchainHash: "0xeC1D6163E05b0Cc4f4e8a0c97c76c4e0f7EE4b51",
      blockchainVerified: true,
      isEncrypted: true,
      isFavorite: false,
      isDeleted: false,
      createdAt: new Date("2024-12-10"),
      updatedAt: new Date("2024-12-12"),
      version: 2,
      shareCount: 1,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/ef4444/ffffff?text=Security+Audit",
   },
   {
      id: "doc-7",
      title: "Marketing Strategy 2025",
      description: "Marketing and growth strategy for 2025",
      fileName: "marketing-strategy-2025.pptx",
      fileSize: 8388608,
      mimeType:
         "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ownerId: "user-2",
      owner: demoUsers[1],
      tags: ["marketing", "strategy", "2025"],
      blockchainVerified: false,
      isEncrypted: false,
      isFavorite: false,
      isDeleted: false,
      createdAt: new Date("2024-12-05"),
      updatedAt: new Date("2024-12-19"),
      version: 4,
      shareCount: 2,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/ec4899/ffffff?text=Marketing+Strategy",
   },
   {
      id: "doc-8",
      title: "Team Meeting Notes - Dec 2024",
      description: "Consolidated meeting notes from December 2024",
      fileName: "meeting-notes-dec-2024.txt",
      fileSize: 524288,
      mimeType: "text/plain",
      ownerId: "user-3",
      owner: demoUsers[2],
      tags: ["meeting-notes", "december", "team"],
      blockchainVerified: false,
      isEncrypted: false,
      isFavorite: true,
      isDeleted: false,
      createdAt: new Date("2024-12-01"),
      updatedAt: new Date("2024-12-22"),
      version: 8,
      shareCount: 1,
      thumbnailUrl:
         "https://via.placeholder.com/400x300/64748b/ffffff?text=Meeting+Notes",
   },
];

const demoCommentsByDocumentId: Record<string, DocumentComment[]> = {
   "doc-1": [
      {
         id: "comment-1",
         documentId: "doc-1",
         userId: "user-2",
         user: demoUsers[1],
         text: "This proposal is ready for the client review call.",
         createdAt: new Date("2024-12-16T09:00:00"),
         updatedAt: new Date("2024-12-16T09:00:00"),
      },
      {
         id: "comment-2",
         documentId: "doc-1",
         userId: "user-3",
         user: demoUsers[2],
         text: "Please confirm the final milestone dates before publishing.",
         createdAt: new Date("2024-12-16T13:30:00"),
         updatedAt: new Date("2024-12-16T13:30:00"),
      },
   ],
   "doc-3": [
      {
         id: "comment-3",
         documentId: "doc-3",
         userId: "user-4",
         user: demoUsers[3],
         text: "We should highlight the blockchain verification flow on page 4.",
         createdAt: new Date("2024-12-18T10:15:00"),
         updatedAt: new Date("2024-12-18T10:15:00"),
      },
   ],
   "doc-5": [
      {
         id: "comment-4",
         documentId: "doc-5",
         userId: "user-1",
         user: demoUsers[0],
         text: "The API examples look good for the recording.",
         createdAt: new Date("2024-12-06T08:45:00"),
         updatedAt: new Date("2024-12-06T08:45:00"),
      },
   ],
};

const demoVersionsByDocumentId: Record<string, DocumentVersion[]> = {
   "doc-1": [
      {
         id: "version-1",
         documentId: "doc-1",
         version: 3,
         fileName: "project-proposal-2025-v3.pdf",
         fileSize: 2457600,
         blockchainHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
         createdBy: demoUsers[0],
         createdAt: new Date("2024-12-15T14:00:00"),
         changes:
            "Added final blockchain integration milestones and timeline updates.",
      },
      {
         id: "version-2",
         documentId: "doc-1",
         version: 2,
         fileName: "project-proposal-2025-v2.pdf",
         fileSize: 2334720,
         blockchainHash: "0x1c1a9a0fbbaea04c7d1c9dfe1e7d9c45f0f5b4d7",
         createdBy: demoUsers[1],
         createdAt: new Date("2024-12-12T11:30:00"),
         changes:
            "Refined scope and budget estimates after stakeholder feedback.",
      },
   ],
   "doc-2": [
      {
         id: "version-3",
         documentId: "doc-2",
         version: 5,
         fileName: "smart-contract-specs-v5.docx",
         fileSize: 1048576,
         blockchainHash: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
         createdBy: demoUsers[1],
         createdAt: new Date("2024-12-10T09:45:00"),
         changes: "Clarified verification steps and contract events.",
      },
   ],
   "doc-3": [
      {
         id: "version-4",
         documentId: "doc-3",
         version: 12,
         fileName: "user-guide-v12.pdf",
         fileSize: 5242880,
         blockchainHash: "0x3b1a35c95d0c4b0b1f946f1d3b5f4d37c5c8a8a1",
         createdBy: demoUsers[0],
         createdAt: new Date("2024-12-18T16:10:00"),
         changes: "Updated onboarding screenshots and navigation instructions.",
      },
   ],
   "doc-5": [
      {
         id: "version-5",
         documentId: "doc-5",
         version: 7,
         fileName: "api-docs-v2-v7.pdf",
         fileSize: 1572864,
         blockchainHash: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
         createdBy: demoUsers[2],
         createdAt: new Date("2024-12-05T12:00:00"),
         changes: "Added final endpoint references and response examples.",
      },
   ],
};

const demoSharesByDocumentId: Record<string, Share[]> = {
   "doc-1": [
      {
         id: "share-1",
         documentId: "doc-1",
         sharedWith: demoUsers[1],
         permission: "view",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-14T10:00:00"),
      },
      {
         id: "share-2",
         documentId: "doc-1",
         sharedWith: demoUsers[2],
         permission: "edit",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-14T11:15:00"),
      },
      {
         id: "share-3",
         documentId: "doc-1",
         sharedWith: demoUsers[3],
         permission: "view",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-15T08:00:00"),
      },
   ],
   "doc-2": [
      {
         id: "share-4",
         documentId: "doc-2",
         sharedWith: demoUsers[0],
         permission: "view",
         sharedBy: demoUsers[1],
         createdAt: new Date("2024-12-09T09:20:00"),
      },
      {
         id: "share-5",
         documentId: "doc-2",
         sharedWith: demoUsers[2],
         permission: "view",
         sharedBy: demoUsers[1],
         createdAt: new Date("2024-12-09T09:55:00"),
      },
   ],
   "doc-3": [
      {
         id: "share-6",
         documentId: "doc-3",
         sharedWith: demoUsers[1],
         permission: "edit",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-18T09:00:00"),
      },
      {
         id: "share-7",
         documentId: "doc-3",
         sharedWith: demoUsers[3],
         permission: "view",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-18T09:30:00"),
      },
      {
         id: "share-8",
         documentId: "doc-3",
         sharedWith: demoUsers[4],
         permission: "view",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-18T10:00:00"),
      },
      {
         id: "share-9",
         documentId: "doc-3",
         sharedWith: demoUsers[5],
         permission: "edit",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-18T10:30:00"),
      },
   ],
   "doc-4": [
      {
         id: "share-10",
         documentId: "doc-4",
         sharedWith: demoUsers[0],
         permission: "view",
         sharedBy: demoUsers[1],
         createdAt: new Date("2024-12-20T14:15:00"),
      },
   ],
   "doc-5": [
      {
         id: "share-11",
         documentId: "doc-5",
         sharedWith: demoUsers[0],
         permission: "edit",
         sharedBy: demoUsers[2],
         createdAt: new Date("2024-12-04T13:00:00"),
      },
      {
         id: "share-12",
         documentId: "doc-5",
         sharedWith: demoUsers[1],
         permission: "view",
         sharedBy: demoUsers[2],
         createdAt: new Date("2024-12-04T13:45:00"),
      },
      {
         id: "share-13",
         documentId: "doc-5",
         sharedWith: demoUsers[3],
         permission: "view",
         sharedBy: demoUsers[2],
         createdAt: new Date("2024-12-04T14:20:00"),
      },
   ],
   "doc-6": [
      {
         id: "share-14",
         documentId: "doc-6",
         sharedWith: demoUsers[4],
         permission: "view",
         sharedBy: demoUsers[0],
         createdAt: new Date("2024-12-11T10:45:00"),
      },
   ],
   "doc-7": [
      {
         id: "share-15",
         documentId: "doc-7",
         sharedWith: demoUsers[0],
         permission: "view",
         sharedBy: demoUsers[1],
         createdAt: new Date("2024-12-18T15:10:00"),
      },
      {
         id: "share-16",
         documentId: "doc-7",
         sharedWith: demoUsers[5],
         permission: "edit",
         sharedBy: demoUsers[1],
         createdAt: new Date("2024-12-18T15:25:00"),
      },
   ],
   "doc-8": [
      {
         id: "share-17",
         documentId: "doc-8",
         sharedWith: demoUsers[1],
         permission: "view",
         sharedBy: demoUsers[2],
         createdAt: new Date("2024-12-21T08:30:00"),
      },
   ],
};

const buildDemoSummary = (document: Document): AIDocumentSummary => ({
   documentId: document.id,
   summary: `${document.title} is a ${document.mimeType} file that covers ${
      document.tags.length > 0 ? document.tags.join(", ") : "general topics"
   }. This demo summary is generated locally so the detail page always has content.`,
   keyPoints: [
      `Owner: ${document.owner.name}`,
      `Version: ${document.version}`,
      `Sharing state: ${document.shareCount} active share${
         document.shareCount === 1 ? "" : "s"
      }`,
   ],
   documentType: document.mimeType,
   language: "en",
   wordCount: document.description
      ? document.description.split(/\s+/).length
      : document.title.split(/\s+/).length,
   generatedAt: new Date(),
});

const buildDemoVerification = (
   document: Document,
   verified = true,
): BlockchainVerification => ({
   verified,
   hash:
      document.blockchainHash ||
      `0x${document.id.replace(/[^a-zA-Z0-9]/g, "").padEnd(40, "0")}`,
   timestamp: new Date(),
   transactionId: `tx-${document.id}-${Date.now()}`,
   blockNumber: 123456 + Number(document.id.replace(/\D/g, "") || 0),
   networkId: "demo-chain",
   confirmations: verified ? 12 : 0,
});

export const getDemoDocument = (documentId: string) =>
   demoDocuments.find((document) => document.id === documentId);

export const getDemoComments = (documentId: string) =>
   demoCommentsByDocumentId[documentId]
      ? [...demoCommentsByDocumentId[documentId]]
      : [];

export const getDemoVersions = (documentId: string) =>
   demoVersionsByDocumentId[documentId]
      ? [...demoVersionsByDocumentId[documentId]]
      : [];

export const getDemoShares = (documentId: string) =>
   demoSharesByDocumentId[documentId]
      ? [...demoSharesByDocumentId[documentId]]
      : [];

export const addDemoComment = (
   documentId: string,
   text: string,
   user: User = demoUsers[0],
) => {
   const comment: DocumentComment = {
      id: `comment-${Date.now()}`,
      documentId,
      userId: user.id,
      user,
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   demoCommentsByDocumentId[documentId] = [
      ...(demoCommentsByDocumentId[documentId] || []),
      comment,
   ];

   return comment;
};

export const addDemoShare = (
   documentId: string,
   sharedWith: User,
   permission: "view" | "edit",
   sharedBy: User = demoUsers[0],
   expiresAt?: Date,
) => {
   const share: Share = {
      id: `share-${Date.now()}`,
      documentId,
      sharedWith,
      permission,
      sharedBy,
      expiresAt,
      createdAt: new Date(),
   };

   demoSharesByDocumentId[documentId] = [
      ...(demoSharesByDocumentId[documentId] || []),
      share,
   ];

   return share;
};

export const removeDemoShare = (shareId: string) => {
   for (const [documentId, shares] of Object.entries(demoSharesByDocumentId)) {
      const nextShares = shares.filter((share) => share.id !== shareId);
      if (nextShares.length !== shares.length) {
         demoSharesByDocumentId[documentId] = nextShares;
         return true;
      }
   }

   return false;
};

export const createDemoShareLink = (
   documentId: string,
   options: ShareLinkOptions,
   createdBy: User = demoUsers[0],
): ShareLink => ({
   id: `link-${documentId}-${Date.now()}`,
   documentId,
   token: `demo-${documentId}-${Date.now()}`,
   url: `${typeof window !== "undefined" ? window.location.origin : "https://docchain.local"}/share/${documentId}?token=demo-${Date.now()}`,
   permission: options.permission,
   expiresAt: options.expiresAt,
   createdBy,
   createdAt: new Date(),
   accessCount: 0,
});

export const createDemoAISummary = buildDemoSummary;
export const createDemoBlockchainVerification = buildDemoVerification;
