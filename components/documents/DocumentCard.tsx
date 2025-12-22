"use client";

import { FC } from "react";
import { Document } from "@/lib/types/document";
import {
   File,
   FileText,
   Image as ImageIcon,
   MoreVertical,
   Download,
   Share2,
   Trash2,
   Eye,
   Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatBytes, formatRelativeTime } from "@/lib/utils/format";

interface DocumentCardProps {
   document: Document;
   onView: (id: string) => void;
   onDownload: (id: string) => void;
   onShare: (id: string) => void;
   onDelete: (id: string) => void;
   onVerify?: (id: string) => void;
   selected?: boolean;
   onSelect?: (id: string) => void;
}

/**
 * DocumentCard Component
 * Displays a single document in card format
 * Follows Single Responsibility Principle - only handles document display
 */
export const DocumentCard: FC<DocumentCardProps> = ({
   document,
   onView,
   onDownload,
   onShare,
   onDelete,
   onVerify,
   selected = false,
   onSelect,
}) => {
   const getFileIcon = () => {
      if (document.mimeType.startsWith("image/")) return ImageIcon;
      if (document.mimeType === "application/pdf") return FileText;
      return File;
   };

   const FileIcon = getFileIcon();

   return (
      <div
         className={cn(
            "group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer",
            selected && "ring-2 ring-primary border-primary"
         )}
         onClick={() => onView(document.id)}
      >
         {/* Selection Checkbox */}
         {onSelect && (
            <div
               className='absolute top-2 left-2 z-10'
               onClick={(e) => e.stopPropagation()}
            >
               <input
                  type='checkbox'
                  checked={selected}
                  onChange={() => onSelect(document.id)}
                  className='w-4 h-4 rounded border-gray-300 cursor-pointer'
               />
            </div>
         )}

         {/* Actions Menu */}
         <div
            className='absolute top-2 right-2 z-10'
            onClick={(e) => e.stopPropagation()}
         >
            <DropdownMenu>
               <DropdownMenuTrigger className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 opacity-0 group-hover:opacity-100'>
                  <MoreVertical size={16} />
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => onView(document.id)}>
                     <Eye size={16} className='mr-2' />
                     View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(document.id)}>
                     <Download size={16} className='mr-2' />
                     Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare(document.id)}>
                     <Share2 size={16} className='mr-2' />
                     Share
                  </DropdownMenuItem>
                  {onVerify && !document.blockchainVerified && (
                     <DropdownMenuItem onClick={() => onVerify(document.id)}>
                        <Shield size={16} className='mr-2' />
                        Verify on Blockchain
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     onClick={() => onDelete(document.id)}
                     className='text-destructive'
                  >
                     <Trash2 size={16} className='mr-2' />
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         {/* Thumbnail/Icon */}
         <div className='flex items-center justify-center h-32 bg-muted rounded-lg mb-3'>
            {document.thumbnailUrl ? (
               <img
                  src={document.thumbnailUrl}
                  alt={document.title}
                  className='w-full h-full object-cover rounded-lg'
               />
            ) : (
               <FileIcon size={48} className='text-muted-foreground' />
            )}
         </div>

         {/* Document Info */}
         <div className='space-y-2'>
            <h3 className='font-medium truncate' title={document.title}>
               {document.title}
            </h3>

            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
               <span>{formatBytes(document.fileSize)}</span>
               <span>•</span>
               <span>{formatRelativeTime(document.updatedAt)}</span>
            </div>

            {/* Tags */}
            {document.tags.length > 0 && (
               <div className='flex flex-wrap gap-1'>
                  {document.tags.slice(0, 2).map((tag) => (
                     <Badge key={tag} variant='secondary' className='text-xs'>
                        {tag}
                     </Badge>
                  ))}
                  {document.tags.length > 2 && (
                     <Badge variant='secondary' className='text-xs'>
                        +{document.tags.length - 2}
                     </Badge>
                  )}
               </div>
            )}

            {/* Status Badges */}
            <div className='flex items-center gap-2 flex-wrap'>
               {document.blockchainVerified && (
                  <Badge variant='default' className='text-xs'>
                     <Shield size={10} className='mr-1' />
                     Verified
                  </Badge>
               )}
               {document.isEncrypted && (
                  <Badge variant='secondary' className='text-xs'>
                     Encrypted
                  </Badge>
               )}
               {document.shareCount > 0 && (
                  <Badge variant='outline' className='text-xs'>
                     <Share2 size={10} className='mr-1' />
                     {document.shareCount}
                  </Badge>
               )}
            </div>
         </div>
      </div>
   );
};
