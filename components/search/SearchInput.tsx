"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useSearchStore } from "@/lib/stores/searchStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X, Clock, Sparkles, Filter, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
   placeholder?: string;
   autoFocus?: boolean;
   onSearch?: (query: string) => void;
   className?: string;
}

/**
 * SearchInput Component
 * Enhanced search input with suggestions, history, and keyboard shortcuts
 * Follows Single Responsibility Principle - focused on search input
 */
export const SearchInput: FC<SearchInputProps> = ({
   placeholder = "Search documents...",
   autoFocus = false,
   onSearch,
   className,
}) => {
   const {
      query,
      suggestions,
      isLoadingSuggestions,
      showFilters,
      searchHistory,
      setQuery,
      search,
      loadSuggestions,
      applySuggestion,
      toggleFilters,
      getRecentSearches,
      clearSearch,
   } = useSearchStore();

   const [isFocused, setIsFocused] = useState(false);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);

   // Keyboard shortcut (Cmd+K / Ctrl+K)
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            inputRef.current?.focus();
            setShowSuggestions(true);
         }

         if (e.key === "Escape") {
            setShowSuggestions(false);
            inputRef.current?.blur();
         }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
   }, []);

   // Load suggestions when query changes
   useEffect(() => {
      if (query && isFocused) {
         const debounceTimer = setTimeout(() => {
            loadSuggestions(query);
         }, 300);

         return () => clearTimeout(debounceTimer);
      }
   }, [query, isFocused, loadSuggestions]);

   // Handle input change
   const handleInputChange = (value: string) => {
      setQuery(value);
      setShowSuggestions(true);
   };

   // Handle search execution
   const handleSearch = async (searchQuery?: string) => {
      const queryToSearch = searchQuery || query;
      if (queryToSearch.trim()) {
         await search(queryToSearch);
         setShowSuggestions(false);
         onSearch?.(queryToSearch);
      }
   };

   // Handle suggestion click
   const handleSuggestionClick = (suggestion: any) => {
      applySuggestion(suggestion);
      setShowSuggestions(false);
   };

   // Handle history item click
   const handleHistoryClick = (historyItem: any) => {
      setQuery(historyItem.query);
      search(historyItem.query, historyItem.filters);
      setShowSuggestions(false);
   };

   // Clear search
   const handleClear = () => {
      clearSearch();
      setShowSuggestions(false);
   };

   const recentSearches = getRecentSearches(5);
   const hasSuggestions = suggestions.length > 0;
   const hasHistory = recentSearches.length > 0;
   const shouldShowDropdown =
      showSuggestions && (hasSuggestions || hasHistory || isLoadingSuggestions);

   return (
      <div className={cn("relative", className)}>
         {/* Search Input */}
         <div className='relative'>
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
               <Search size={18} />
            </div>

            <Input
               ref={inputRef}
               value={query}
               onChange={(e) => handleInputChange(e.target.value)}
               onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
               }}
               onBlur={() => {
                  setIsFocused(false);
                  // Delay hiding suggestions to allow clicks
                  setTimeout(() => setShowSuggestions(false), 200);
               }}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                     handleSearch();
                  }
               }}
               placeholder={placeholder}
               autoFocus={autoFocus}
               className='pl-11 pr-20 h-12 text-base'
            />

            {/* Right side controls */}
            <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1'>
               {query && (
                  <Button
                     variant='ghost'
                     size='sm'
                     onClick={handleClear}
                     className='h-7 w-7 p-0'
                  >
                     <X size={14} />
                  </Button>
               )}

               <Button
                  variant={showFilters ? "default" : "ghost"}
                  size='sm'
                  onClick={toggleFilters}
                  className='h-7 px-2'
               >
                  <Filter size={14} />
               </Button>

               {!isFocused && (
                  <Badge variant='secondary' className='ml-1 text-xs'>
                     <Keyboard size={10} className='mr-1' />
                     ⌘K
                  </Badge>
               )}
            </div>
         </div>

         {/* Suggestions Dropdown */}
         {shouldShowDropdown && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden'>
               <Command className='rounded-lg border-none'>
                  <CommandList>
                     {/* Loading state */}
                     {isLoadingSuggestions && (
                        <CommandEmpty>
                           <div className='flex items-center gap-2 text-muted-foreground'>
                              <Sparkles size={16} className='animate-pulse' />
                              Finding suggestions...
                           </div>
                        </CommandEmpty>
                     )}

                     {/* AI Suggestions */}
                     {hasSuggestions && (
                        <CommandGroup heading='AI Suggestions'>
                           {suggestions.map((suggestion) => (
                              <CommandItem
                                 key={suggestion.id}
                                 onSelect={() =>
                                    handleSuggestionClick(suggestion)
                                 }
                                 className='flex items-center gap-3 cursor-pointer'
                              >
                                 <span className='text-lg'>
                                    {suggestion.icon}
                                 </span>
                                 <div className='flex-1'>
                                    <p className='text-sm'>{suggestion.text}</p>
                                    <p className='text-xs text-muted-foreground capitalize'>
                                       {suggestion.type} •{" "}
                                       {Math.round(suggestion.confidence * 100)}
                                       % match
                                    </p>
                                 </div>
                                 <Sparkles size={14} className='text-primary' />
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     )}

                     {/* Recent Searches */}
                     {hasHistory && (
                        <CommandGroup heading='Recent Searches'>
                           {recentSearches.map((item) => (
                              <CommandItem
                                 key={item.id}
                                 onSelect={() => handleHistoryClick(item)}
                                 className='flex items-center gap-3 cursor-pointer'
                              >
                                 <Clock
                                    size={16}
                                    className='text-muted-foreground'
                                 />
                                 <div className='flex-1'>
                                    <p className='text-sm'>{item.query}</p>
                                    <p className='text-xs text-muted-foreground'>
                                       {item.resultsCount} results •{" "}
                                       {new Date(
                                          item.timestamp
                                       ).toLocaleDateString()}
                                    </p>
                                 </div>
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     )}

                     {/* Empty state */}
                     {!isLoadingSuggestions &&
                        !hasSuggestions &&
                        !hasHistory && (
                           <CommandEmpty>
                              <div className='text-center py-6 text-muted-foreground'>
                                 <Search
                                    size={24}
                                    className='mx-auto mb-2 opacity-50'
                                 />
                                 <p>Start typing to search documents...</p>
                              </div>
                           </CommandEmpty>
                        )}
                  </CommandList>
               </Command>
            </div>
         )}
      </div>
   );
};
