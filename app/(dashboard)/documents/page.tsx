"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { useToast } from "@/lib/hooks/useToast";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentFilters } from "@/components/documents/DocumentFilters";
import { DocumentActions } from "@/components/documents/DocumentActions";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

/**
 * DocumentsPage Component
 * Main documents management page
 * Follows Single Responsibility Principle - orchestrates document components
 * Follows DRY Principle - reuses components, no duplicated logic
 */
const DocumentsPage: FC = () => {
   const router = useRouter();
   const toast = useToast();
   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

   const {
      documents,
      filters,
      sortBy,
      viewMode,
      selectedDocuments,
      isLoading,
      isUploading,
      uploadProgress,
      fetchDocuments,
      uploadDocument,
      setFilters,
      setSortBy,
      setViewMode,
      toggleSelectDocument,
      selectAll,
      clearSelection,
      deleteDocument,
      deleteMultiple,
      verifyBlockchain,
   } = useDocumentStore();

   // Fetch documents on mount and when filters/sort change
   useEffect(() => {
      fetchDocuments(filters);
   }, [filters, sortBy, fetchDocuments]);

   // Handle document upload
   const handleUpload = async (file: File, metadata: any) => {
      try {
         await uploadDocument(file, metadata);
         setUploadDialogOpen(false);
         toast.success("Upload successful", "Document uploaded successfully");
      } catch (error: any) {
         toast.error(
            "Upload failed",
            error.message || "Failed to upload document"
         );
      }
   };

   // Handle document view
   const handleView = (id: string) => {
      router.push(`/documents/${id}`);
   };

   // Handle document download
   const handleDownload = async (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (doc?.downloadUrl) {
         window.open(doc.downloadUrl, "_blank");
         toast.success("Download started");
      } else {
         toast.error("Download failed", "Download URL not available");
      }
   };

   // Handle document share
   const handleShare = (id: string) => {
      router.push(`/documents/${id}?tab=share`);
   };

   // Handle document delete
   const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this document?")) {
         try {
            await deleteDocument(id);
            toast.success("Document deleted");
         } catch (error: any) {
            toast.error("Delete failed", error.message);
         }
      }
   };

   // Handle blockchain verification
   const handleVerify = async (id: string) => {
      try {
         await verifyBlockchain(id);
         toast.success(
            "Verification started",
            "Document is being verified on blockchain"
         );
      } catch (error: any) {
         toast.error("Verification failed", error.message);
      }
   };

   // Handle bulk actions
   const handleBulkDownload = () => {
      selectedDocuments.forEach((id) => handleDownload(id));
   };

   const handleBulkShare = () => {
      // Navigate to bulk share interface (to be implemented)
      toast.info("Bulk share", "Feature coming soon");
   };

   const handleBulkDelete = async () => {
      if (
         confirm(
            `Are you sure you want to delete ${selectedDocuments.length} document(s)?`
         )
      ) {
         try {
            await deleteMultiple(selectedDocuments);
            toast.success(`${selectedDocuments.length} document(s) deleted`);
         } catch (error: any) {
            toast.error("Delete failed", error.message);
         }
      }
   };

   const handleBulkVerify = async () => {
      try {
         for (const id of selectedDocuments) {
            await verifyBlockchain(id);
         }
         toast.success(
            "Verification started",
            `${selectedDocuments.length} document(s) are being verified`
         );
      } catch (error: any) {
         toast.error("Verification failed", error.message);
      }
   };

   // Handle filter reset
   const handleResetFilters = () => {
      setFilters({});
      setSortBy("recent");
   };

   return (
      <div className='container mx-auto p-6 space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold'>Documents</h1>
               <p className='text-muted-foreground mt-1'>
                  Manage and organize your documents
               </p>
            </div>
         </div>

         {/* Filters */}
         <DocumentFilters
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={setFilters}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
         />

         {/* Actions Bar */}
         <DocumentActions
            selectedCount={selectedDocuments.length}
            onUpload={() => setUploadDialogOpen(true)}
            onDownloadSelected={handleBulkDownload}
            onShareSelected={handleBulkShare}
            onDeleteSelected={handleBulkDelete}
            onVerifySelected={handleBulkVerify}
         />

         {/* Documents List */}
         <DocumentList
            documents={documents}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onView={handleView}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={handleDelete}
            onVerify={handleVerify}
            selectedDocuments={selectedDocuments}
            onSelectDocument={toggleSelectDocument}
            isLoading={isLoading}
         />

         {/* Upload Dialog */}
         <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className='max-w-2xl'>
               <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                     Upload a new document to your DocChain storage
                  </DialogDescription>
               </DialogHeader>
               <DocumentUploader
                  onUpload={handleUpload}
                  isUploading={isUploading}
                  progress={uploadProgress}
               />
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default DocumentsPage;
