import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Document } from "@/lib/types/document";

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
      resultsCount: number
   ) => void;
   clearHistory: () => void;
   removeFromHistory: (id: string) => void;

   // Saved searches
   saveSearch: (
      name: string,
      query: string,
      filters: SearchFilters,
      isAlert?: boolean
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

// Mock search function (will be replaced with real API)
const mockSearch = async (
   query: string,
   filters: SearchFilters
): Promise<SearchResult[]> => {
   // Simulate API delay
   await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 700)
   );

   // Mock results with highlights
   const mockResults: SearchResult[] = [
      {
         id: "search-result-1",
         title: "Project Proposal 2025",
         description:
            "Comprehensive project proposal for Q1 2025 blockchain integration initiative",
         fileName: "project-proposal-2025.pdf",
         fileSize: 2457600,
         mimeType: "application/pdf",
         ownerId: "user-1",
         owner: {
            id: "user-1",
            email: "admin@docchain.com",
            name: "Admin User",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
            mfaEnabled: true,
            isActive: true,
         },
         tags: ["proposal", "blockchain", "Q1-2025"],
         blockchainHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
         blockchainVerified: true,
         isEncrypted: true,
         isFavorite: true,
         isDeleted: false,
         createdAt: new Date("2024-12-01"),
         updatedAt: new Date("2024-12-15"),
         version: 3,
         shareCount: 5,
         thumbnailUrl:
            "https://via.placeholder.com/400x300/4f46e5/ffffff?text=Project+Proposal",
         score: 0.95,
         highlights: {
            title: "**Project** Proposal 2025",
            description:
               "Comprehensive project **proposal** for Q1 2025 **blockchain** integration initiative",
         },
      },
   ];

   return mockResults.filter((result) => {
      const queryLower = query.toLowerCase();
      const titleMatch = result.title.toLowerCase().includes(queryLower);
      const descMatch = result.description?.toLowerCase().includes(queryLower);
      const tagMatch = result.tags.some((tag) =>
         tag.toLowerCase().includes(queryLower)
      );

      return titleMatch || descMatch || tagMatch;
   });
};

// Mock AI suggestions
const mockAISuggestions = async (
   query: string
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
               const results = await mockSearch(searchQuery, searchFilters);

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
                  (item) => item.id !== id
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
                  (search) => search.id !== id
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
      }
   )
);
