"use client";

import { FC, useEffect, useState } from "react";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Trash2,
   RotateCcw,
   AlertTriangle,
   Calendar,
   FileX,
   Grid3X3,
   List,
   Search,
   Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, addDays } from "date-fns";

/**
 * TrashPage Component
 * Display and manage deleted documents with restore/permanent delete options
 * Follows Single Responsibility Principle - focused on trash management
 */
const TrashPage: FC = () => {
   const {
      documents,
      isLoading,
      fetchDocuments,
      restoreDocument,
      permanentlyDeleteDocument,
   } = useDocumentStore();

   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [sortBy, setSortBy] = useState<"deleted" | "name" | "expires">(
      "deleted"
   );
   const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

   // Filter deleted documents
   const deletedDocuments = documents.filter((doc) => doc.isDeleted);

   // Sort deleted documents
   const sortedDocuments = [...deletedDocuments].sort((a, b) => {
      switch (sortBy) {
         case "deleted":
            return (
               new Date(b.deletedAt || 0).getTime() -
               new Date(a.deletedAt || 0).getTime()
            );
         case "name":
            return a.title.localeCompare(b.title);
         case "expires":
            const aExpires = addDays(a.deletedAt || new Date(), 30).getTime();
            const bExpires = addDays(b.deletedAt || new Date(), 30).getTime();
            return aExpires - bExpires;
         default:
            return 0;
      }
   });

   // Fetch documents on mount
   useEffect(() => {
      fetchDocuments();
   }, [fetchDocuments]);

   // Handle document actions
   const handleRestore = async (id: string) => {
      try {
         await restoreDocument(id);
         console.log("Document restored:", id);
      } catch (error) {
         console.error("Failed to restore document:", error);
      }
   };

   const handlePermanentDelete = async (id: string) => {
      if (
         window.confirm(
            "Are you sure you want to permanently delete this document? This action cannot be undone."
         )
      ) {
         try {
            await permanentlyDeleteDocument(id);
            console.log("Document permanently deleted:", id);
         } catch (error) {
            console.error("Failed to permanently delete document:", error);
         }
      }
   };

   // Handle bulk actions
   const handleBulkRestore = async () => {
      if (
         window.confirm(
            `Restore ${selectedDocuments.length} selected documents?`
         )
      ) {
         try {
            for (const id of selectedDocuments) {
               await restoreDocument(id);
            }
            setSelectedDocuments([]);
            console.log("Bulk restore completed");
         } catch (error) {
            console.error("Failed to bulk restore:", error);
         }
      }
   };

   const handleBulkDelete = async () => {
      if (
         window.confirm(
            `Permanently delete ${selectedDocuments.length} selected documents? This action cannot be undone.`
         )
      ) {
         try {
            for (const id of selectedDocuments) {
               await permanentlyDeleteDocument(id);
            }
            setSelectedDocuments([]);
            console.log("Bulk delete completed");
         } catch (error) {
            console.error("Failed to bulk delete:", error);
         }
      }
   };

   const handleEmptyTrash = async () => {
      if (
         window.confirm(
            "Are you sure you want to empty the trash? All documents will be permanently deleted and cannot be recovered."
         )
      ) {
         try {
            for (const doc of deletedDocuments) {
               await permanentlyDeleteDocument(doc.id);
            }
            console.log("Trash emptied");
         } catch (error) {
            console.error("Failed to empty trash:", error);
         }
      }
   };

   // Calculate expiration date (30 days from deletion)
   const getExpirationDate = (deletedAt: Date) => {
      return addDays(deletedAt, 30);
   };

   const isExpiringSoon = (deletedAt: Date) => {
      const expirationDate = getExpirationDate(deletedAt);
      const daysUntilExpiration = Math.ceil(
         (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiration <= 7;
   };

   // Handle selection
   const handleSelectDocument = (id: string, selected: boolean) => {
      if (selected) {
         setSelectedDocuments((prev) => [...prev, id]);
      } else {
         setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
      }
   };

   const handleSelectAll = () => {
      if (selectedDocuments.length === deletedDocuments.length) {
         setSelectedDocuments([]);
      } else {
         setSelectedDocuments(deletedDocuments.map((d) => d.id));
      }
   };

   // Loading state
   if (isLoading) {
      return (
         <div className='container mx-auto p-6'>
            <div className='flex items-center justify-center h-64'>
               <div className='text-center'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4' />
                  <p className='text-sm text-muted-foreground'>
                     Loading deleted documents...
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
               <div className='p-2 bg-red-500/10 rounded-lg'>
                  <Trash2 size={24} className='text-red-500' />
               </div>
               <div>
                  <h1 className='text-3xl font-bold'>Trash</h1>
                  <p className='text-muted-foreground'>
                     {deletedDocuments.length} deleted document
                     {deletedDocuments.length !== 1 ? "s" : ""}
                     {deletedDocuments.length > 0 &&
                        " - Documents are permanently deleted after 30 days"}
                  </p>
               </div>
            </div>

            {deletedDocuments.length > 0 && (
               <div className='flex items-center gap-2'>
                  {/* Bulk actions */}
                  {selectedDocuments.length > 0 && (
                     <div className='flex gap-2 mr-2'>
                        <Button
                           variant='default'
                           size='sm'
                           onClick={handleBulkRestore}
                        >
                           <RotateCcw size={16} className='mr-2' />
                           Restore ({selectedDocuments.length})
                        </Button>
                        <Button
                           variant='destructive'
                           size='sm'
                           onClick={handleBulkDelete}
                        >
                           <Trash2 size={16} className='mr-2' />
                           Delete ({selectedDocuments.length})
                        </Button>
                     </div>
                  )}

                  {/* Empty trash */}
                  <Button
                     variant='destructive'
                     size='sm'
                     onClick={handleEmptyTrash}
                     className='mr-2'
                  >
                     Empty Trash
                  </Button>

                  {/* Sort dropdown */}
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className='px-3 py-2 border rounded-lg bg-background'
                  >
                     <option value='deleted'>Recently Deleted</option>
                     <option value='name'>Name</option>
                     <option value='expires'>Expiration Date</option>
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

         {/* Warning banner */}
         {deletedDocuments.length > 0 && (
            <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6'>
               <div className='flex items-center gap-3'>
                  <AlertTriangle size={20} className='text-yellow-600' />
                  <div className='flex-1'>
                     <p className='text-sm font-medium'>
                        Automatic Deletion Notice
                     </p>
                     <p className='text-sm text-muted-foreground'>
                        Documents in trash are automatically deleted after 30
                        days.
                        {deletedDocuments.filter((d) =>
                           isExpiringSoon(d.deletedAt!)
                        ).length > 0 &&
                           ` ${
                              deletedDocuments.filter((d) =>
                                 isExpiringSoon(d.deletedAt!)
                              ).length
                           } documents will be deleted within 7 days.`}
                     </p>
                  </div>
                  {deletedDocuments.length > 0 && (
                     <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleSelectAll}
                     >
                        {selectedDocuments.length === deletedDocuments.length
                           ? "Deselect All"
                           : "Select All"}
                     </Button>
                  )}
               </div>
            </div>
         )}

         {/* Empty state */}
         {deletedDocuments.length === 0 && (
            <div className='text-center py-16'>
               <div className='mb-6'>
                  <Trash2
                     size={64}
                     className='mx-auto text-muted-foreground opacity-50'
                  />
               </div>
               <h3 className='text-xl font-semibold mb-2'>Trash is Empty</h3>
               <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                  No deleted documents. When you delete documents, they'll
                  appear here and can be restored for 30 days.
               </p>
               <Button
                  variant='default'
                  onClick={() => (window.location.href = "/documents")}
               >
                  <Search size={16} className='mr-2' />
                  Browse Documents
               </Button>
            </div>
         )}

         {/* Deleted Documents */}
         {deletedDocuments.length > 0 && (
            <>
               {/* Quick stats */}
               <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6'>
                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Trash2 size={20} className='text-red-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {deletedDocuments.length}
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              In Trash
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <AlertTriangle size={20} className='text-yellow-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {
                                 deletedDocuments.filter((d) =>
                                    isExpiringSoon(d.deletedAt!)
                                 ).length
                              }
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Expiring Soon
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Archive size={20} className='text-blue-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {Math.round(
                                 deletedDocuments.reduce(
                                    (sum, d) => sum + d.fileSize,
                                    0
                                 ) / 1048576
                              )}
                              MB
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Total Size
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Calendar size={20} className='text-purple-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {selectedDocuments.length}
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Selected
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
                     const expirationDate = getExpirationDate(
                        document.deletedAt!
                     );
                     const isSelected = selectedDocuments.includes(document.id);
                     const expiringSoon = isExpiringSoon(document.deletedAt!);

                     return (
                        <div
                           key={document.id}
                           className={cn(
                              "relative group border rounded-lg transition-all",
                              isSelected ? "ring-2 ring-primary" : ""
                           )}
                        >
                           {/* Selection checkbox */}
                           <div className='absolute top-2 left-2 z-10'>
                              <input
                                 type='checkbox'
                                 checked={isSelected}
                                 onChange={(e) =>
                                    handleSelectDocument(
                                       document.id,
                                       e.target.checked
                                    )
                                 }
                                 className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
                              />
                           </div>

                           {/* Expiration warning */}
                           {expiringSoon && (
                              <div className='absolute top-2 right-2 z-10'>
                                 <Badge variant='destructive'>
                                    <AlertTriangle size={12} className='mr-1' />
                                    Expiring Soon
                                 </Badge>
                              </div>
                           )}

                           <div className='opacity-75'>
                              <DocumentCard
                                 document={document}
                                 onView={() => {}} // Deleted docs can't be viewed
                                 onDownload={() => {}} // Deleted docs can't be downloaded
                                 onShare={() => {}} // Deleted docs can't be shared
                                 onDelete={() => {}}
                                 onVerify={() => {}}
                              />
                           </div>

                           {/* Deletion info */}
                           <div className='absolute bottom-2 left-2 right-2 z-10'>
                              <div className='bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm'>
                                 <p className='font-medium'>
                                    Deleted{" "}
                                    {formatDistanceToNow(document.deletedAt!)}{" "}
                                    ago
                                 </p>
                                 <p className='opacity-75'>
                                    Expires{" "}
                                    {format(expirationDate, "MMM dd, yyyy")}
                                 </p>
                              </div>
                           </div>

                           {/* Action buttons */}
                           <div className='absolute inset-x-0 bottom-16 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
                              <div className='flex justify-center gap-2 px-2'>
                                 <Button
                                    variant='default'
                                    size='sm'
                                    onClick={() => handleRestore(document.id)}
                                    className='flex-1'
                                 >
                                    <RotateCcw size={16} className='mr-2' />
                                    Restore
                                 </Button>
                                 <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={() =>
                                       handlePermanentDelete(document.id)
                                    }
                                    className='flex-1'
                                 >
                                    <FileX size={16} className='mr-2' />
                                    Delete
                                 </Button>
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
                        Browse Documents
                     </Button>
                     <Button
                        variant='outline'
                        onClick={() => (window.location.href = "/search")}
                     >
                        <Search size={16} className='mr-2' />
                        Search
                     </Button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default TrashPage;
