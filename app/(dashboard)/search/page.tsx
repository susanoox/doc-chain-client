"use client";

import { FC, useEffect } from "react";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearchStore } from "@/lib/stores/searchStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, History, Bookmark, Sparkles, TrendingUp } from "lucide-react";

/**
 * SearchPage Component
 * Main search page with enhanced search capabilities
 * Follows Single Responsibility Principle - orchestrates search features
 */
const SearchPage: FC = () => {
   const {
      query,
      searchHistory,
      savedSearches,
      suggestions,
      executeSavedSearch,
      getRecentSearches,
      clearHistory,
   } = useSearchStore();

   const recentSearches = getRecentSearches(10);
   const popularSavedSearches = savedSearches.slice(0, 5);

   return (
      <div className='container mx-auto p-6 max-w-7xl'>
         {/* Header */}
         <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
               <Search size={28} className='text-primary' />
               <h1 className='text-3xl font-bold'>Search</h1>
            </div>
            <p className='text-muted-foreground'>
               Find your documents with AI-powered search
            </p>
         </div>

         {/* Search Input */}
         <div className='mb-6'>
            <SearchInput autoFocus className='max-w-4xl mx-auto' />
         </div>

         {/* Search Filters */}
         <div className='mb-6'>
            <SearchFilters />
         </div>

         {/* Main Content */}
         <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Search Results - Main content */}
            <div className='lg:col-span-3'>
               <SearchResults />
            </div>

            {/* Sidebar - Search helpers */}
            <div className='space-y-6'>
               {/* Recent Searches */}
               {recentSearches.length > 0 && (
                  <div className='bg-card border rounded-lg p-4'>
                     <div className='flex items-center justify-between mb-3'>
                        <h3 className='font-semibold flex items-center gap-2'>
                           <History size={16} />
                           Recent Searches
                        </h3>
                        {recentSearches.length > 5 && (
                           <Button
                              variant='ghost'
                              size='sm'
                              onClick={clearHistory}
                              className='text-xs'
                           >
                              Clear
                           </Button>
                        )}
                     </div>
                     <div className='space-y-2'>
                        {recentSearches.slice(0, 8).map((search) => (
                           <button
                              key={search.id}
                              onClick={() =>
                                 useSearchStore
                                    .getState()
                                    .search(search.query, search.filters)
                              }
                              className='w-full text-left p-2 rounded hover:bg-muted transition-colors'
                           >
                              <p className='text-sm font-medium truncate'>
                                 {search.query}
                              </p>
                              <div className='flex items-center gap-2 mt-1'>
                                 <Badge variant='secondary' className='text-xs'>
                                    {search.resultsCount} results
                                 </Badge>
                                 <span className='text-xs text-muted-foreground'>
                                    {new Date(
                                       search.timestamp
                                    ).toLocaleDateString()}
                                 </span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {/* Saved Searches */}
               {popularSavedSearches.length > 0 && (
                  <div className='bg-card border rounded-lg p-4'>
                     <h3 className='font-semibold flex items-center gap-2 mb-3'>
                        <Bookmark size={16} />
                        Saved Searches
                     </h3>
                     <div className='space-y-2'>
                        {popularSavedSearches.map((saved) => (
                           <button
                              key={saved.id}
                              onClick={() => executeSavedSearch(saved.id)}
                              className='w-full text-left p-2 rounded hover:bg-muted transition-colors'
                           >
                              <p className='text-sm font-medium truncate'>
                                 {saved.name}
                              </p>
                              <p className='text-xs text-muted-foreground truncate'>
                                 {saved.query}
                              </p>
                              {saved.isAlert && (
                                 <Badge
                                    variant='outline'
                                    className='text-xs mt-1'
                                 >
                                    Alert enabled
                                 </Badge>
                              )}
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {/* Search Tips */}
               {!query && (
                  <div className='bg-card border rounded-lg p-4'>
                     <h3 className='font-semibold flex items-center gap-2 mb-3'>
                        <Sparkles size={16} />
                        Search Tips
                     </h3>
                     <div className='space-y-3 text-sm text-muted-foreground'>
                        <div>
                           <p className='font-medium text-foreground mb-1'>
                              Natural Language
                           </p>
                           <p>Try "blockchain documents from last week"</p>
                        </div>
                        <div>
                           <p className='font-medium text-foreground mb-1'>
                              Keyboard Shortcuts
                           </p>
                           <p>
                              Press{" "}
                              <kbd className='px-1 py-0.5 bg-muted rounded text-xs'>
                                 ⌘K
                              </kbd>{" "}
                              to focus search
                           </p>
                        </div>
                        <div>
                           <p className='font-medium text-foreground mb-1'>
                              Filters
                           </p>
                           <p>Use filters for precise results</p>
                        </div>
                        <div>
                           <p className='font-medium text-foreground mb-1'>
                              File Types
                           </p>
                           <p>Search within PDF, Word, Excel files</p>
                        </div>
                     </div>
                  </div>
               )}

               {/* Popular Searches */}
               {!query && (
                  <div className='bg-card border rounded-lg p-4'>
                     <h3 className='font-semibold flex items-center gap-2 mb-3'>
                        <TrendingUp size={16} />
                        Popular Searches
                     </h3>
                     <div className='flex flex-wrap gap-2'>
                        {[
                           "blockchain verification",
                           "quarterly reports",
                           "project proposals",
                           "security audit",
                           "meeting notes",
                           "technical docs",
                        ].map((term) => (
                           <Badge
                              key={term}
                              variant='secondary'
                              className='cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                              onClick={() =>
                                 useSearchStore.getState().search(term)
                              }
                           >
                              {term}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}

               {/* AI Insights */}
               {query && suggestions.length > 0 && (
                  <div className='bg-linear-to-br from-primary/10 to-secondary/10 border rounded-lg p-4'>
                     <h3 className='font-semibold flex items-center gap-2 mb-3'>
                        <Sparkles size={16} className='text-primary' />
                        AI Suggestions
                     </h3>
                     <div className='space-y-2'>
                        {suggestions.slice(0, 3).map((suggestion) => (
                           <button
                              key={suggestion.id}
                              onClick={() =>
                                 useSearchStore
                                    .getState()
                                    .applySuggestion(suggestion)
                              }
                              className='w-full text-left p-2 rounded bg-background/50 hover:bg-background transition-colors'
                           >
                              <div className='flex items-center gap-2'>
                                 <span className='text-lg'>
                                    {suggestion.icon}
                                 </span>
                                 <div className='flex-1'>
                                    <p className='text-sm font-medium'>
                                       {suggestion.text}
                                    </p>
                                    <p className='text-xs text-muted-foreground capitalize'>
                                       {suggestion.type} •{" "}
                                       {Math.round(suggestion.confidence * 100)}
                                       % confidence
                                    </p>
                                 </div>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default SearchPage;
