"use client";

import { FC, useEffect, useState } from "react";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Share2,
   Users,
   Eye,
   Edit,
   Download,
   Globe,
   Link,
   Copy,
   Grid3X3,
   List,
   Search,
   UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";

/**
 * SharedPage Component
 * Display documents shared with the current user
 * Follows Single Responsibility Principle - focused on shared document management
 */
const SharedPage: FC = () => {
   const { user } = useAuth();
   const { documents, isLoading, fetchDocuments } = useDocumentStore();

   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [sortBy, setSortBy] = useState<"recent" | "name" | "permission">(
      "recent"
   );
   const [permissionFilter, setPermissionFilter] = useState<
      "all" | "view" | "edit"
   >("all");

   // Filter documents shared with current user
   // For demo purposes, show docs that:
   // 1. User is not the owner
   // 2. Has been shared (shareCount > 0)
   const sharedDocuments = documents.filter((doc) => {
      return doc.ownerId !== user?.id && doc.shareCount > 0;
   });

   // Apply permission filter
   const filteredDocuments = sharedDocuments.filter((doc) => {
      if (permissionFilter === "all") return true;

      // For demo, assume view permission for docs with shareCount <= 2, edit for others
      const hasEditPermission = doc.shareCount > 2;
      return permissionFilter === "edit"
         ? hasEditPermission
         : !hasEditPermission;
   });

   // Sort shared documents
   const sortedDocuments = [...filteredDocuments].sort((a, b) => {
      switch (sortBy) {
         case "recent":
            return (
               new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
         case "name":
            return a.title.localeCompare(b.title);
         case "permission":
            // For demo, use shareCount as proxy for permission level
            const aPermission = a.shareCount > 2 ? "edit" : "view";
            const bPermission = b.shareCount > 2 ? "edit" : "view";
            return bPermission.localeCompare(aPermission);
         default:
            return 0;
      }
   });

   // Fetch documents on mount
   useEffect(() => {
      fetchDocuments();
   }, [fetchDocuments]);

   // Handle document actions based on permissions
   const handleView = (id: string) => {
      window.location.href = `/documents/${id}`;
   };

   const handleDownload = (id: string) => {
      console.log("Download shared document:", id);
   };

   const handleShare = (id: string) => {
      console.log("Share document:", id);
   };

   const handleEdit = (id: string) => {
      window.location.href = `/documents/${id}/edit`;
   };

   const handleCopyLink = async (id: string) => {
      const shareUrl = `${window.location.origin}/share/${id}`;
      try {
         await navigator.clipboard.writeText(shareUrl);
         console.log("Share link copied");
      } catch (error) {
         console.error("Failed to copy share link:", error);
      }
   };

   // Get user's permission for a document
   const getUserPermission = (documentId: string): "view" | "edit" | null => {
      const document = documents.find((d) => d.id === documentId);
      if (!document) return null;
      // For demo, assume edit permission for docs with shareCount > 2
      return document.shareCount > 2 ? "edit" : "view";
   };

   // Loading state
   if (isLoading) {
      return (
         <div className='container mx-auto p-6'>
            <div className='flex items-center justify-center h-64'>
               <div className='text-center'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4' />
                  <p className='text-sm text-muted-foreground'>
                     Loading shared documents...
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className='container mx-auto p-6'>
         {/* Header */}
         <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
               <div className='p-2 bg-blue-500/10 rounded-lg'>
                  <Share2 size={24} className='text-blue-500' />
               </div>
               <div>
                  <h1 className='text-3xl font-bold'>Shared with Me</h1>
                  <p className='text-muted-foreground'>
                     {filteredDocuments.length} document
                     {filteredDocuments.length !== 1 ? "s" : ""} shared with you
                  </p>
               </div>
            </div>

            {filteredDocuments.length > 0 && (
               <div className='flex items-center gap-2'>
                  {/* Permission filter */}
                  <select
                     value={permissionFilter}
                     onChange={(e) =>
                        setPermissionFilter(e.target.value as any)
                     }
                     className='px-3 py-2 border rounded-lg bg-background'
                  >
                     <option value='all'>All Permissions</option>
                     <option value='view'>View Only</option>
                     <option value='edit'>Can Edit</option>
                  </select>

                  {/* Sort dropdown */}
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className='px-3 py-2 border rounded-lg bg-background'
                  >
                     <option value='recent'>Recently Shared</option>
                     <option value='name'>Name</option>
                     <option value='permission'>Permission Level</option>
                  </select>

                  {/* View mode toggle */}
                  <div className='flex border rounded-lg'>
                     <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size='sm'
                        onClick={() => setViewMode("grid")}
                        className='rounded-r-none'
                     >
                        <Grid3X3 size={16} />
                     </Button>
                     <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size='sm'
                        onClick={() => setViewMode("list")}
                        className='rounded-l-none border-l'
                     >
                        <List size={16} />
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {/* Empty state */}
         {filteredDocuments.length === 0 && (
            <div className='text-center py-16'>
               <div className='mb-6'>
                  <Share2
                     size={64}
                     className='mx-auto text-muted-foreground opacity-50'
                  />
               </div>
               <h3 className='text-xl font-semibold mb-2'>
                  No Shared Documents
               </h3>
               <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                  You don't have any documents shared with you yet. When someone
                  shares a document with you, it will appear here.
               </p>
               <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                  <Button
                     variant='default'
                     onClick={() => (window.location.href = "/documents")}
                  >
                     <Search size={16} className='mr-2' />
                     Browse Your Documents
                  </Button>
                  <Button
                     variant='outline'
                     onClick={() => (window.location.href = "/search")}
                  >
                     <Search size={16} className='mr-2' />
                     Search All Documents
                  </Button>
               </div>
            </div>
         )}

         {/* Shared Documents */}
         {filteredDocuments.length > 0 && (
            <>
               {/* Quick stats */}
               <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6'>
                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Share2 size={20} className='text-blue-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {sharedDocuments.length}
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Total Shared
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Eye size={20} className='text-green-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {
                                 sharedDocuments.filter(
                                    (d) => d.shareCount <= 2
                                 ).length
                              }
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              View Only
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Edit size={20} className='text-purple-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {
                                 sharedDocuments.filter((d) => d.shareCount > 2)
                                    .length
                              }
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Can Edit
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <UserCheck size={20} className='text-orange-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {
                                 new Set(sharedDocuments.map((d) => d.ownerId))
                                    .size
                              }
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Sharers
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Documents Grid/List */}
               <div
                  className={cn(
                     "grid gap-4",
                     viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 max-w-4xl"
                  )}
               >
                  {sortedDocuments.map((document) => {
                     const userPermission = getUserPermission(document.id);

                     return (
                        <div key={document.id} className='relative group'>
                           <DocumentCard
                              document={document}
                              onView={handleView}
                              onDownload={handleDownload}
                              onShare={handleShare}
                              onDelete={() => {}} // Shared docs can't be deleted by viewers
                              onVerify={() => {}}
                           />

                           {/* Permission badge */}
                           <div className='absolute top-2 left-2 z-10'>
                              <Badge
                                 variant={
                                    userPermission === "edit"
                                       ? "default"
                                       : "secondary"
                                 }
                              >
                                 {userPermission === "edit" ? (
                                    <>
                                       <Edit size={12} className='mr-1' /> Edit
                                    </>
                                 ) : (
                                    <>
                                       <Eye size={12} className='mr-1' /> View
                                    </>
                                 )}
                              </Badge>
                           </div>

                           {/* Quick actions */}
                           <div className='absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1'>
                              <Button
                                 variant='secondary'
                                 size='sm'
                                 onClick={() => handleCopyLink(document.id)}
                                 className='h-8 w-8 p-0'
                              >
                                 <Copy size={12} />
                              </Button>

                              {userPermission === "edit" && (
                                 <Button
                                    variant='default'
                                    size='sm'
                                    onClick={() => handleEdit(document.id)}
                                    className='h-8 w-8 p-0'
                                 >
                                    <Edit size={12} />
                                 </Button>
                              )}
                           </div>

                           {/* Owner info */}
                           <div className='absolute bottom-2 left-2 z-10'>
                              <div className='bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm'>
                                 Shared by {document.owner.name}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>

               {/* Bottom actions */}
               <div className='flex justify-center mt-8 pt-6 border-t'>
                  <div className='flex gap-3'>
                     <Button
                        variant='outline'
                        onClick={() => (window.location.href = "/documents")}
                     >
                        Your Documents
                     </Button>
                     <Button
                        variant='outline'
                        onClick={() => (window.location.href = "/search")}
                     >
                        <Search size={16} className='mr-2' />
                        Search
                     </Button>
                     <Button
                        variant='outline'
                        onClick={() => (window.location.href = "/share/create")}
                     >
                        <Share2 size={16} className='mr-2' />
                        Share Documents
                     </Button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default SharedPage;
