"use client";

import { FC, useEffect } from "react";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentList } from "@/components/documents/DocumentList";
import { Button } from "@/components/ui/button";
import { Star, Heart, Grid3X3, List, Search, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * FavoritesPage Component
 * Display and manage favorite documents
 * Follows Single Responsibility Principle - focused on favorites management
 */
const FavoritesPage: FC = () => {
   const { documents, isLoading, fetchDocuments, toggleFavorite } =
      useDocumentStore();

   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [sortBy, setSortBy] = useState<"recent" | "name" | "size">("recent");

   // Filter only favorite documents
   const favoriteDocuments = documents.filter((doc) => doc.isFavorite);

   // Sort favorites
   const sortedFavorites = [...favoriteDocuments].sort((a, b) => {
      switch (sortBy) {
         case "recent":
            return (
               new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
         case "name":
            return a.title.localeCompare(b.title);
         case "size":
            return b.fileSize - a.fileSize;
         default:
            return 0;
      }
   });

   // Fetch documents on mount
   useEffect(() => {
      fetchDocuments();
   }, [fetchDocuments]);

   // Handle document actions
   const handleView = (id: string) => {
      window.location.href = `/documents/${id}`;
   };

   const handleDownload = (id: string) => {
      console.log("Download favorite:", id);
   };

   const handleShare = (id: string) => {
      console.log("Share favorite:", id);
   };

   const handleDelete = (id: string) => {
      console.log("Delete favorite:", id);
   };

   const handleVerify = (id: string) => {
      console.log("Verify favorite:", id);
   };

   const handleRemoveFromFavorites = async (id: string) => {
      try {
         await toggleFavorite(id);
      } catch (error) {
         console.error("Failed to remove from favorites:", error);
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
                     Loading favorites...
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
               <div className='p-2 bg-yellow-500/10 rounded-lg'>
                  <Star
                     size={24}
                     className='text-yellow-500'
                     fill='currentColor'
                  />
               </div>
               <div>
                  <h1 className='text-3xl font-bold'>Favorites</h1>
                  <p className='text-muted-foreground'>
                     {favoriteDocuments.length} document
                     {favoriteDocuments.length !== 1 ? "s" : ""} marked as
                     favorite
                  </p>
               </div>
            </div>

            {favoriteDocuments.length > 0 && (
               <div className='flex items-center gap-2'>
                  {/* Sort dropdown */}
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className='px-3 py-2 border rounded-lg bg-background'
                  >
                     <option value='recent'>Recently Modified</option>
                     <option value='name'>Name</option>
                     <option value='size'>File Size</option>
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
         {favoriteDocuments.length === 0 && (
            <div className='text-center py-16'>
               <div className='mb-6'>
                  <Star
                     size={64}
                     className='mx-auto text-muted-foreground opacity-50'
                  />
               </div>
               <h3 className='text-xl font-semibold mb-2'>No Favorites Yet</h3>
               <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                  Start building your favorites collection by clicking the star
                  icon on any document you want to access quickly.
               </p>
               <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                  <Button
                     variant='default'
                     onClick={() => (window.location.href = "/documents")}
                  >
                     <Search size={16} className='mr-2' />
                     Browse Documents
                  </Button>
                  <Button
                     variant='outline'
                     onClick={() => (window.location.href = "/search")}
                  >
                     <Search size={16} className='mr-2' />
                     Search Documents
                  </Button>
               </div>
            </div>
         )}

         {/* Favorites Grid/List */}
         {favoriteDocuments.length > 0 && (
            <>
               {/* Quick stats */}
               <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Star
                           size={20}
                           className='text-yellow-500'
                           fill='currentColor'
                        />
                        <div>
                           <p className='text-2xl font-bold'>
                              {favoriteDocuments.length}
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Favorites
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <Heart size={20} className='text-red-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {
                                 favoriteDocuments.filter(
                                    (d) => d.blockchainVerified
                                 ).length
                              }
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Verified
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center gap-3'>
                        <SortAsc size={20} className='text-blue-500' />
                        <div>
                           <p className='text-2xl font-bold'>
                              {Math.round(
                                 favoriteDocuments.reduce(
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
               </div>

               {/* Documents */}
               <div
                  className={cn(
                     "grid gap-4",
                     viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 max-w-4xl"
                  )}
               >
                  {sortedFavorites.map((document) => (
                     <div key={document.id} className='relative group'>
                        <DocumentCard
                           document={document}
                           onView={handleView}
                           onDownload={handleDownload}
                           onShare={handleShare}
                           onDelete={handleDelete}
                           onVerify={handleVerify}
                        />

                        {/* Favorite indicator overlay */}
                        <div className='absolute top-2 left-2 z-10'>
                           <div className='p-1.5 bg-yellow-500 rounded-full shadow-lg'>
                              <Star
                                 size={12}
                                 className='text-white'
                                 fill='currentColor'
                              />
                           </div>
                        </div>

                        {/* Remove from favorites button (on hover) */}
                        <Button
                           variant='destructive'
                           size='sm'
                           onClick={() =>
                              handleRemoveFromFavorites(document.id)
                           }
                           className='absolute top-2 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                           Remove
                        </Button>
                     </div>
                  ))}
               </div>

               {/* Bottom actions */}
               <div className='flex justify-center mt-8 pt-6 border-t'>
                  <div className='flex gap-3'>
                     <Button
                        variant='outline'
                        onClick={() => (window.location.href = "/documents")}
                     >
                        Browse All Documents
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

export default FavoritesPage;
