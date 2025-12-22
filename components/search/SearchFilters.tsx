"use client";

import { FC, useState } from "react";
import {
   useSearchStore,
   SearchFilters as SearchFiltersType,
} from "@/lib/stores/searchStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Filter,
   X,
   Calendar as CalendarIcon,
   FileType,
   User,
   Tag,
   Shield,
   Lock,
   Star,
   Share2,
   HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils/format";

/**
 * SearchFilters Component
 * Advanced search filters with date range, file types, owners, etc.
 * Follows Single Responsibility Principle - focused on search filtering
 */
export const SearchFilters: FC = () => {
   const {
      filters,
      showFilters,
      setFilters,
      clearFilters,
      toggleFilters,
      search,
   } = useSearchStore();

   const [dateFrom, setDateFrom] = useState<Date | undefined>(filters.dateFrom);
   const [dateTo, setDateTo] = useState<Date | undefined>(filters.dateTo);

   // File type options
   const fileTypeOptions = [
      { value: "application/pdf", label: "PDF", icon: "📄" },
      {
         value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
         label: "Word",
         icon: "📝",
      },
      {
         value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         label: "Excel",
         icon: "📊",
      },
      {
         value: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
         label: "PowerPoint",
         icon: "📈",
      },
      { value: "text/plain", label: "Text", icon: "📃" },
      { value: "image/*", label: "Images", icon: "🖼️" },
   ];

   // Mock users for owner filter
   const userOptions = [
      { id: "user-1", name: "Admin User", email: "admin@docchain.com" },
      { id: "user-2", name: "John Doe", email: "john@docchain.com" },
      { id: "user-3", name: "Jane Smith", email: "jane@docchain.com" },
   ];

   // Common tags for quick selection
   const popularTags = [
      "blockchain",
      "proposal",
      "technical",
      "documentation",
      "report",
      "security",
      "marketing",
      "meeting-notes",
   ];

   // Handle filter changes
   const updateFilter = <K extends keyof SearchFiltersType>(
      key: K,
      value: SearchFiltersType[K]
   ) => {
      setFilters({ [key]: value });
   };

   // Handle array filter toggles (file types, owners, tags)
   const toggleArrayFilter = <K extends keyof SearchFiltersType>(
      key: K,
      value: string,
      currentArray: string[] | undefined
   ) => {
      const array = currentArray || [];
      const newArray = array.includes(value)
         ? array.filter((item) => item !== value)
         : [...array, value];

      setFilters({ [key]: newArray.length > 0 ? newArray : undefined });
   };

   // Handle date range updates
   const handleDateFromChange = (date: Date | undefined) => {
      setDateFrom(date);
      updateFilter("dateFrom", date);
   };

   const handleDateToChange = (date: Date | undefined) => {
      setDateTo(date);
      updateFilter("dateTo", date);
   };

   // Apply filters and trigger search
   const applyFilters = () => {
      search();
   };

   // Clear all filters
   const handleClearFilters = () => {
      setDateFrom(undefined);
      setDateTo(undefined);
      clearFilters();
      search();
   };

   // Count active filters
   const activeFilterCount = Object.keys(filters).filter((key) => {
      const value = filters[key as keyof SearchFiltersType];
      return (
         value !== undefined &&
         value !== null &&
         (Array.isArray(value) ? value.length > 0 : true)
      );
   }).length;

   if (!showFilters) {
      return null;
   }

   return (
      <div className='border rounded-lg bg-card p-4 space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
               <Filter size={18} />
               <h3 className='font-semibold'>Advanced Filters</h3>
               {activeFilterCount > 0 && (
                  <Badge variant='secondary'>{activeFilterCount} active</Badge>
               )}
            </div>
            <div className='flex items-center gap-2'>
               <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClearFilters}
                  disabled={activeFilterCount === 0}
               >
                  Clear All
               </Button>
               <Button variant='ghost' size='sm' onClick={toggleFilters}>
                  <X size={16} />
               </Button>
            </div>
         </div>

         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Date Range */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2'>
                  <CalendarIcon size={16} />
                  Date Range
               </Label>
               <div className='space-y-2'>
                  <Popover>
                     <PopoverTrigger>
                        <Button
                           variant='outline'
                           className='w-full justify-start'
                        >
                           <CalendarIcon size={16} className='mr-2' />
                           {dateFrom
                              ? dateFrom.toLocaleDateString()
                              : "From date"}
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                           mode='single'
                           selected={dateFrom}
                           onSelect={handleDateFromChange}
                           disabled={(date) =>
                              date > new Date() ||
                              (dateTo ? date > dateTo : false)
                           }
                           initialFocus
                        />
                     </PopoverContent>
                  </Popover>

                  <Popover>
                     <PopoverTrigger>
                        <Button
                           variant='outline'
                           className='w-full justify-start'
                        >
                           <CalendarIcon size={16} className='mr-2' />
                           {dateTo ? dateTo.toLocaleDateString() : "To date"}
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                           mode='single'
                           selected={dateTo}
                           onSelect={handleDateToChange}
                           disabled={(date) =>
                              date > new Date() ||
                              (dateFrom ? date < dateFrom : false)
                           }
                           initialFocus
                        />
                     </PopoverContent>
                  </Popover>
               </div>
            </div>

            {/* File Types */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2'>
                  <FileType size={16} />
                  File Types
               </Label>
               <div className='space-y-2'>
                  {fileTypeOptions.map((option) => (
                     <div
                        key={option.value}
                        className='flex items-center space-x-2'
                     >
                        <Checkbox
                           id={option.value}
                           checked={
                              filters.fileTypes?.includes(option.value) || false
                           }
                           onCheckedChange={() =>
                              toggleArrayFilter(
                                 "fileTypes",
                                 option.value,
                                 filters.fileTypes
                              )
                           }
                        />
                        <Label
                           htmlFor={option.value}
                           className='flex items-center gap-2 cursor-pointer'
                        >
                           <span>{option.icon}</span>
                           {option.label}
                        </Label>
                     </div>
                  ))}
               </div>
            </div>

            {/* File Size */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2'>
                  <HardDrive size={16} />
                  File Size
               </Label>
               <div className='space-y-2'>
                  <div>
                     <Label className='text-xs text-muted-foreground'>
                        Min Size (MB)
                     </Label>
                     <Input
                        type='number'
                        placeholder='0'
                        value={filters.minSize ? filters.minSize / 1048576 : ""}
                        onChange={(e) => {
                           const mb = parseFloat(e.target.value);
                           updateFilter(
                              "minSize",
                              mb ? mb * 1048576 : undefined
                           );
                        }}
                     />
                  </div>
                  <div>
                     <Label className='text-xs text-muted-foreground'>
                        Max Size (MB)
                     </Label>
                     <Input
                        type='number'
                        placeholder='100'
                        value={filters.maxSize ? filters.maxSize / 1048576 : ""}
                        onChange={(e) => {
                           const mb = parseFloat(e.target.value);
                           updateFilter(
                              "maxSize",
                              mb ? mb * 1048576 : undefined
                           );
                        }}
                     />
                  </div>
               </div>
            </div>

            {/* Owners */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2'>
                  <User size={16} />
                  Document Owner
               </Label>
               <div className='space-y-2'>
                  {userOptions.map((user) => (
                     <div key={user.id} className='flex items-center space-x-2'>
                        <Checkbox
                           id={user.id}
                           checked={filters.owners?.includes(user.id) || false}
                           onCheckedChange={() =>
                              toggleArrayFilter(
                                 "owners",
                                 user.id,
                                 filters.owners
                              )
                           }
                        />
                        <Label htmlFor={user.id} className='cursor-pointer'>
                           <div>
                              <p className='text-sm'>{user.name}</p>
                              <p className='text-xs text-muted-foreground'>
                                 {user.email}
                              </p>
                           </div>
                        </Label>
                     </div>
                  ))}
               </div>
            </div>

            {/* Tags */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2'>
                  <Tag size={16} />
                  Tags
               </Label>
               <div className='space-y-2'>
                  <div className='flex flex-wrap gap-1'>
                     {popularTags.map((tag) => (
                        <Badge
                           key={tag}
                           variant={
                              filters.tags?.includes(tag)
                                 ? "default"
                                 : "secondary"
                           }
                           className='cursor-pointer'
                           onClick={() =>
                              toggleArrayFilter("tags", tag, filters.tags)
                           }
                        >
                           {tag}
                        </Badge>
                     ))}
                  </div>
               </div>
            </div>

            {/* Properties */}
            <div className='space-y-3'>
               <Label className='flex items-center gap-2'>
                  <Shield size={16} />
                  Properties
               </Label>
               <div className='space-y-3'>
                  <div className='flex items-center space-x-2'>
                     <Checkbox
                        id='blockchain-verified'
                        checked={filters.blockchainVerified || false}
                        onCheckedChange={(checked) =>
                           updateFilter(
                              "blockchainVerified",
                              checked ? true : undefined
                           )
                        }
                     />
                     <Label
                        htmlFor='blockchain-verified'
                        className='flex items-center gap-2 cursor-pointer'
                     >
                        <Shield size={14} className='text-primary' />
                        Blockchain Verified
                     </Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                     <Checkbox
                        id='encrypted'
                        checked={filters.isEncrypted || false}
                        onCheckedChange={(checked) =>
                           updateFilter(
                              "isEncrypted",
                              checked ? true : undefined
                           )
                        }
                     />
                     <Label
                        htmlFor='encrypted'
                        className='flex items-center gap-2 cursor-pointer'
                     >
                        <Lock size={14} className='text-orange-500' />
                        Encrypted
                     </Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                     <Checkbox
                        id='favorites'
                        checked={filters.isFavorite || false}
                        onCheckedChange={(checked) =>
                           updateFilter(
                              "isFavorite",
                              checked ? true : undefined
                           )
                        }
                     />
                     <Label
                        htmlFor='favorites'
                        className='flex items-center gap-2 cursor-pointer'
                     >
                        <Star size={14} className='text-yellow-500' />
                        Favorites Only
                     </Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                     <Checkbox
                        id='shared-with-me'
                        checked={filters.sharedWithMe || false}
                        onCheckedChange={(checked) =>
                           updateFilter(
                              "sharedWithMe",
                              checked ? true : undefined
                           )
                        }
                     />
                     <Label
                        htmlFor='shared-with-me'
                        className='flex items-center gap-2 cursor-pointer'
                     >
                        <Share2 size={14} className='text-blue-500' />
                        Shared with Me
                     </Label>
                  </div>
               </div>
            </div>
         </div>

         {/* Apply Button */}
         <div className='flex justify-end pt-4 border-t'>
            <Button onClick={applyFilters}>Apply Filters</Button>
         </div>
      </div>
   );
};
