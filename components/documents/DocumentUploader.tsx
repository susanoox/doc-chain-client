"use client";

import { FC, useCallback, useState } from "react";
import { Upload, X, File, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/useToast";
import { DocumentMetadata } from "@/lib/types/document";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils/format";

interface DocumentUploaderProps {
   onUpload: (file: File, metadata: DocumentMetadata) => Promise<void>;
   isUploading?: boolean;
   progress?: number;
}

const ACCEPTED_FILE_TYPES = {
   "application/pdf": [".pdf"],
   "application/msword": [".doc"],
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
   ],
   "text/plain": [".txt"],
   "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * DocumentUploader Component
 * Handles file upload with drag-and-drop support
 * Follows Single Responsibility Principle - only handles upload UI
 */
export const DocumentUploader: FC<DocumentUploaderProps> = ({
   onUpload,
   isUploading = false,
   progress = 0,
}) => {
   const [isDragging, setIsDragging] = useState(false);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [metadata, setMetadata] = useState<DocumentMetadata>({
      title: "",
      description: "",
      tags: [],
      isEncrypted: false,
   });
   const [tagInput, setTagInput] = useState("");
   const toast = useToast();

   // Validate file
   const validateFile = useCallback((file: File): string | null => {
      if (file.size > MAX_FILE_SIZE) {
         return `File size exceeds ${formatBytes(MAX_FILE_SIZE)}`;
      }
      return null;
   }, []);

   // Handle file selection
   const handleFileSelect = useCallback(
      (file: File) => {
         const error = validateFile(file);
         if (error) {
            toast.error("Invalid file", error);
            return;
         }

         setSelectedFile(file);
         setMetadata((prev) => ({
            ...prev,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
         }));
      },
      [validateFile, toast]
   );

   // Drag and drop handlers
   const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
   }, []);

   const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
   }, []);

   const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
   }, []);

   const handleDrop = useCallback(
      (e: React.DragEvent) => {
         e.preventDefault();
         e.stopPropagation();
         setIsDragging(false);

         const files = e.dataTransfer.files;
         if (files.length > 0) {
            handleFileSelect(files[0]);
         }
      },
      [handleFileSelect]
   );

   // File input change
   const handleFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
         const files = e.target.files;
         if (files && files.length > 0) {
            handleFileSelect(files[0]);
         }
      },
      [handleFileSelect]
   );

   // Add tag
   const handleAddTag = useCallback(() => {
      if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
         setMetadata((prev) => ({
            ...prev,
            tags: [...prev.tags, tagInput.trim()],
         }));
         setTagInput("");
      }
   }, [tagInput, metadata.tags]);

   // Remove tag
   const handleRemoveTag = useCallback((tag: string) => {
      setMetadata((prev) => ({
         ...prev,
         tags: prev.tags.filter((t) => t !== tag),
      }));
   }, []);

   // Handle upload
   const handleUpload = useCallback(async () => {
      if (!selectedFile) return;

      if (!metadata.title.trim()) {
         toast.error("Title required", "Please enter a title for the document");
         return;
      }

      try {
         await onUpload(selectedFile, metadata);

         // Reset form
         setSelectedFile(null);
         setMetadata({
            title: "",
            description: "",
            tags: [],
            isEncrypted: false,
         });
         setTagInput("");
      } catch (error) {
         // Error handled by parent component
      }
   }, [selectedFile, metadata, onUpload, toast]);

   // Get file icon
   const getFileIcon = (file: File) => {
      if (file.type.startsWith("image/")) return ImageIcon;
      if (file.type === "application/pdf") return FileText;
      return File;
   };

   const FileIcon = selectedFile ? getFileIcon(selectedFile) : Upload;

   return (
      <div className='space-y-6'>
         {/* Drop Zone */}
         <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
               "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
               isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50",
               isUploading && "pointer-events-none opacity-50"
            )}
         >
            <input
               type='file'
               id='file-upload'
               className='hidden'
               onChange={handleFileInputChange}
               accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
               disabled={isUploading}
            />

            {!selectedFile ? (
               <label
                  htmlFor='file-upload'
                  className='cursor-pointer flex flex-col items-center gap-4'
               >
                  <div className='rounded-full bg-muted p-4'>
                     <Upload size={32} className='text-muted-foreground' />
                  </div>
                  <div>
                     <p className='text-lg font-medium'>
                        Drag and drop your file here
                     </p>
                     <p className='text-sm text-muted-foreground mt-1'>
                        or click to browse
                     </p>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                     Supports PDF, DOC, DOCX, TXT, Images (Max{" "}
                     {formatBytes(MAX_FILE_SIZE)})
                  </p>
               </label>
            ) : (
               <div className='flex items-start gap-4'>
                  <div className='rounded-lg bg-muted p-3'>
                     <FileIcon size={32} className='text-muted-foreground' />
                  </div>
                  <div className='flex-1 text-left'>
                     <p className='font-medium'>{selectedFile.name}</p>
                     <p className='text-sm text-muted-foreground mt-1'>
                        {formatBytes(selectedFile.size)}
                     </p>
                  </div>
                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={() => setSelectedFile(null)}
                     disabled={isUploading}
                  >
                     <X size={20} />
                  </Button>
               </div>
            )}

            {/* Progress Bar */}
            {isUploading && (
               <div className='absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg overflow-hidden'>
                  <div
                     className='h-full bg-primary transition-all duration-300'
                     style={{ width: `${progress}%` }}
                  />
               </div>
            )}
         </div>

         {/* Metadata Form */}
         {selectedFile && (
            <div className='space-y-4'>
               <div>
                  <Label htmlFor='title'>Title *</Label>
                  <Input
                     id='title'
                     value={metadata.title}
                     onChange={(e) =>
                        setMetadata((prev) => ({
                           ...prev,
                           title: e.target.value,
                        }))
                     }
                     placeholder='Enter document title'
                     disabled={isUploading}
                  />
               </div>

               <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                     id='description'
                     value={metadata.description}
                     onChange={(e) =>
                        setMetadata((prev) => ({
                           ...prev,
                           description: e.target.value,
                        }))
                     }
                     placeholder='Enter document description'
                     rows={3}
                     disabled={isUploading}
                  />
               </div>

               <div>
                  <Label htmlFor='tags'>Tags</Label>
                  <div className='flex gap-2'>
                     <Input
                        id='tags'
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                           }
                        }}
                        placeholder='Add tags'
                        disabled={isUploading}
                     />
                     <Button
                        type='button'
                        variant='secondary'
                        onClick={handleAddTag}
                        disabled={isUploading || !tagInput.trim()}
                     >
                        Add
                     </Button>
                  </div>
                  {metadata.tags.length > 0 && (
                     <div className='flex flex-wrap gap-2 mt-2'>
                        {metadata.tags.map((tag) => (
                           <Badge
                              key={tag}
                              variant='secondary'
                              className='cursor-pointer'
                              onClick={() => handleRemoveTag(tag)}
                           >
                              {tag}
                              <X size={12} className='ml-1' />
                           </Badge>
                        ))}
                     </div>
                  )}
               </div>

               <Button
                  onClick={handleUpload}
                  disabled={isUploading || !metadata.title.trim()}
                  className='w-full'
               >
                  {isUploading
                     ? `Uploading... ${progress}%`
                     : "Upload Document"}
               </Button>
            </div>
         )}
      </div>
   );
};
