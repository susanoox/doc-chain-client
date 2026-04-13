import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Document } from "@/lib/types/document";
import { demoDocuments } from "@/lib/mocks/demoData";
import { filterDocuments, sortDocuments } from "@/lib/utils/documentQueries";
import { useDocumentStore } from "@/lib/stores/documentStore";

export interface SearchQuery {
   id: string;
   query: string;
   filters: SearchFilters;
   timestamp: Date;
   resultsCount: number;
}

export interface SavedSearch {
   id: string;
   name: string;
   query: string;
   filters: SearchFilters;
   createdAt: Date;
   isAlert: boolean; // Notify when new matches found
}

export interface SearchFilters {
   dateFrom?: Date;
   dateTo?: Date;
   fileTypes?: string[];
   owners?: string[];
   tags?: string[];
   blockchainVerified?: boolean;
   isEncrypted?: boolean;
   isFavorite?: boolean;
   sharedWithMe?: boolean;
   minSize?: number;
   maxSize?: number;
}

export interface SearchResult extends Document {
   score: number; // Search relevance score
   highlights: {
      title?: string;
      description?: string;
      content?: string;
   };
}

export interface AISearchSuggestion {
   id: string;
   text: string;
   type: "query" | "filter" | "refinement";
   icon?: string;
   confidence: number;
}

interface SearchState {
   // Current search
   query: string;
   filters: SearchFilters;
   results: SearchResult[];
   isSearching: boolean;
   searchError: string | null;

   // Search history & saved searches
   searchHistory: SearchQuery[];
   savedSearches: SavedSearch[];

   // AI suggestions
   suggestions: AISearchSuggestion[];
   isLoadingSuggestions: boolean;

   // UI state
   showFilters: boolean;
   viewMode: "grid" | "list";
   sortBy: "relevance" | "date" | "name" | "size";

   // Actions
   setQuery: (query: string) => void;
   setFilters: (filters: Partial<SearchFilters>) => void;
   clearFilters: () => void;
   search: (query?: string, filters?: Partial<SearchFilters>) => Promise<void>;
   clearSearch: () => void;

   // History management
   addToHistory: (
      query: string,
      filters: SearchFilters,
      resultsCount: number,
   ) => void;
   clearHistory: () => void;
   removeFromHistory: (id: string) => void;

   // Saved searches
   saveSearch: (
      name: string,
      query: string,
      filters: SearchFilters,
      isAlert?: boolean,
   ) => void;
   deleteSavedSearch: (id: string) => void;
   executeSavedSearch: (id: string) => Promise<void>;

   // AI suggestions
   loadSuggestions: (query: string) => Promise<void>;
   applySuggestion: (suggestion: AISearchSuggestion) => void;

   // UI actions
   toggleFilters: () => void;
   setViewMode: (mode: "grid" | "list") => void;
   setSortBy: (sortBy: "relevance" | "date" | "name" | "size") => void;

   // Utility
   clearError: () => void;
   getRecentSearches: (limit?: number) => SearchQuery[];
}

const mockAISuggestions = async (
   query: string,
): Promise<AISearchSuggestion[]> => {
   await new Promise((resolve) => setTimeout(resolve, 200));

   const suggestions: AISearchSuggestion[] = [
      {
         id: "sugg-1",
         text: `"${query}" documents`,
         type: "query",
         icon: "📄",
         confidence: 0.9,
      },
      {
         id: "sugg-2",
         text: "Filter by PDF files",
         type: "filter",
         icon: "🔍",
         confidence: 0.8,
      },
      {
         id: "sugg-3",
         text: "Show only recent files",
         type: "refinement",
         icon: "📅",
         confidence: 0.7,
      },
   ];

   return suggestions.slice(0, Math.floor(Math.random() * 3) + 1);
};

export const useSearchStore = create<SearchState>()(
   persist(
      (set, get) => ({
         // Initial state
         query: "",
         filters: {},
         results: [],
         isSearching: false,
         searchError: null,
         searchHistory: [],
         savedSearches: [],
         suggestions: [],
         isLoadingSuggestions: false,
         showFilters: false,
         viewMode: "grid",
         sortBy: "relevance",

         // Actions
         setQuery: (query) => set({ query }),

         setFilters: (newFilters) =>
            set((state) => ({
               filters: { ...state.filters, ...newFilters },
            })),

         clearFilters: () => set({ filters: {} }),

         search: async (query, filters) => {
            const state = get();
            const searchQuery = query ?? state.query;
            const searchFilters = filters
               ? { ...state.filters, ...filters }
               : state.filters;

            if (!searchQuery.trim()) {
               set({ results: [], searchError: null });
               return;
            }

            set({ isSearching: true, searchError: null });

            try {
               await new Promise((resolve) =>
                  setTimeout(resolve, 200 + Math.random() * 300),
               );

               const documents = sortDocuments(
                  filterDocuments(demoDocuments, {
                     search: searchQuery,
                     tags: searchFilters.tags,
                     owner: searchFilters.owners,
                     blockchainVerified: searchFilters.blockchainVerified,
                     isEncrypted: searchFilters.isEncrypted,
                     isFavorite: searchFilters.isFavorite,
                     dateFrom: searchFilters.dateFrom,
                     dateTo: searchFilters.dateTo,
                  }),
                  "recent",
               );

               const results: SearchResult[] = documents.map((document) => ({
                  ...document,
                  score: document.title
                     .toLowerCase()
                     .includes(searchQuery.toLowerCase())
                     ? 0.95
                     : 0.7,
                  highlights: {
                     title: document.title,
                     description: document.description,
                  },
               }));

               set({
                  results,
                  isSearching: false,
                  query: searchQuery,
                  filters: searchFilters,
               });

               // Add to history
               get().addToHistory(searchQuery, searchFilters, results.length);
            } catch (error: any) {
               set({
                  searchError: error?.message || "Search failed",
                  isSearching: false,
                  results: [],
               });
            }
         },

         clearSearch: () =>
            set({
               query: "",
               results: [],
               filters: {},
               searchError: null,
            }),

         // History management
         addToHistory: (query, filters, resultsCount) => {
            const newQuery: SearchQuery = {
               id: `search-${Date.now()}`,
               query,
               filters,
               timestamp: new Date(),
               resultsCount,
            };

            set((state) => ({
               searchHistory: [newQuery, ...state.searchHistory.slice(0, 19)], // Keep last 20
            }));
         },

         clearHistory: () => set({ searchHistory: [] }),

         removeFromHistory: (id) =>
            set((state) => ({
               searchHistory: state.searchHistory.filter(
                  (item) => item.id !== id,
               ),
            })),

         // Saved searches
         saveSearch: (name, query, filters, isAlert = false) => {
            const newSaved: SavedSearch = {
               id: `saved-${Date.now()}`,
               name,
               query,
               filters,
               createdAt: new Date(),
               isAlert,
            };

            set((state) => ({
               savedSearches: [newSaved, ...state.savedSearches],
            }));
         },

         deleteSavedSearch: (id) =>
            set((state) => ({
               savedSearches: state.savedSearches.filter(
                  (search) => search.id !== id,
               ),
            })),

         executeSavedSearch: async (id) => {
            const state = get();
            const savedSearch = state.savedSearches.find((s) => s.id === id);

            if (savedSearch) {
               await get().search(savedSearch.query, savedSearch.filters);
            }
         },

         // AI suggestions
         loadSuggestions: async (query) => {
            if (!query.trim()) {
               set({ suggestions: [] });
               return;
            }

            set({ isLoadingSuggestions: true });

            try {
               const suggestions = await mockAISuggestions(query);
               set({ suggestions, isLoadingSuggestions: false });
            } catch (error) {
               set({ suggestions: [], isLoadingSuggestions: false });
            }
         },

         applySuggestion: (suggestion) => {
            const state = get();

            switch (suggestion.type) {
               case "query":
                  get().search(suggestion.text.replace(/"/g, ""));
                  break;
               case "filter":
                  // Apply specific filters based on suggestion
                  if (suggestion.text.includes("PDF")) {
                     get().setFilters({ fileTypes: ["application/pdf"] });
                  }
                  break;
               case "refinement":
                  if (suggestion.text.includes("recent")) {
                     const weekAgo = new Date();
                     weekAgo.setDate(weekAgo.getDate() - 7);
                     get().setFilters({ dateFrom: weekAgo });
                  }
                  break;
            }
         },

         // UI actions
         toggleFilters: () =>
            set((state) => ({ showFilters: !state.showFilters })),

         setViewMode: (mode) => set({ viewMode: mode }),

         setSortBy: (sortBy) => set({ sortBy }),

         // Utility
         clearError: () => set({ searchError: null }),

         getRecentSearches: (limit = 5) => {
            const state = get();
            return state.searchHistory.slice(0, limit);
         },
      }),
      {
         name: "search-storage",
         partialize: (state) => ({
            searchHistory: state.searchHistory,
            savedSearches: state.savedSearches,
            viewMode: state.viewMode,
            sortBy: state.sortBy,
         }),
      },
   ),
);
