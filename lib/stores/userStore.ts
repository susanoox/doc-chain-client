import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
   id: string;
   email: string;
   name: string;
   bio?: string;
   avatar?: string;
   role: "admin" | "editor" | "viewer";
   createdAt: Date;
   updatedAt: Date;
}

export interface UserPreferences {
   theme: "light" | "dark" | "system";
   language: string;
   timezone: string;
   dateFormat: string;
   notifications: {
      email: boolean;
      push: boolean;
      documentShared: boolean;
      documentVerified: boolean;
      securityAlerts: boolean;
   };
   ai: {
      enabled: boolean;
      suggestions: boolean;
      autoSummarize: boolean;
      autoTag: boolean;
   };
   display: {
      defaultView: "grid" | "list";
      itemsPerPage: number;
      sidebarCollapsed: boolean;
   };
}

export interface Session {
   id: string;
   deviceName: string;
   deviceType: "desktop" | "mobile" | "tablet";
   browser: string;
   ipAddress: string;
   location: string;
   lastActive: Date;
   isCurrent: boolean;
}

export interface SecurityEvent {
   id: string;
   type:
      | "login"
      | "logout"
      | "password_change"
      | "mfa_enabled"
      | "mfa_disabled"
      | "session_revoked";
   timestamp: Date;
   ipAddress: string;
   location: string;
   deviceName: string;
   success: boolean;
}

interface UserState {
   // Profile
   profile: UserProfile | null;
   preferences: UserPreferences | null;
   sessions: Session[];
   securityEvents: SecurityEvent[];

   // Loading states
   isLoading: boolean;
   isUpdating: boolean;
   isUploadingAvatar: boolean;

   // Error
   error: string | null;

   // Actions - Profile
   fetchProfile: () => Promise<void>;
   updateProfile: (data: Partial<UserProfile>) => Promise<void>;
   uploadAvatar: (file: File) => Promise<void>;
   deleteAccount: () => Promise<void>;

   // Actions - Security
   changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
   fetchSessions: () => Promise<void>;
   logoutSession: (sessionId: string) => Promise<void>;
   logoutAllSessions: () => Promise<void>;
   fetchSecurityEvents: () => Promise<void>;

   // Actions - Preferences
   fetchPreferences: () => Promise<void>;
   updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
   setTheme: (theme: "light" | "dark" | "system") => Promise<void>;

   // Utility
   clearError: () => void;
   reset: () => void;
}

const defaultPreferences: UserPreferences = {
   theme: "system",
   language: "en",
   timezone: "UTC",
   dateFormat: "MM/DD/YYYY",
   notifications: {
      email: true,
      push: true,
      documentShared: true,
      documentVerified: true,
      securityAlerts: true,
   },
   ai: {
      enabled: true,
      suggestions: true,
      autoSummarize: true,
      autoTag: true,
   },
   display: {
      defaultView: "grid",
      itemsPerPage: 20,
      sidebarCollapsed: false,
   },
};

// Mock data for development
const mockProfile: UserProfile = {
   id: "user-1",
   email: "admin@docchain.com",
   name: "Admin User",
   bio: "System Administrator and Document Manager",
   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
   role: "admin",
   createdAt: new Date("2024-01-01"),
   updatedAt: new Date(),
};

const mockSessions: Session[] = [
   {
      id: "session-1",
      deviceName: "MacBook Pro",
      deviceType: "desktop",
      browser: "Chrome 120",
      ipAddress: "192.168.1.100",
      location: "San Francisco, CA",
      lastActive: new Date(),
      isCurrent: true,
   },
   {
      id: "session-2",
      deviceName: "iPhone 15 Pro",
      deviceType: "mobile",
      browser: "Safari 17",
      ipAddress: "192.168.1.101",
      location: "San Francisco, CA",
      lastActive: new Date(Date.now() - 3600000), // 1 hour ago
      isCurrent: false,
   },
   {
      id: "session-3",
      deviceName: "iPad Air",
      deviceType: "tablet",
      browser: "Safari 17",
      ipAddress: "10.0.0.50",
      location: "New York, NY",
      lastActive: new Date(Date.now() - 86400000), // 1 day ago
      isCurrent: false,
   },
];

const mockSecurityEvents: SecurityEvent[] = [
   {
      id: "event-1",
      type: "login",
      timestamp: new Date(),
      ipAddress: "192.168.1.100",
      location: "San Francisco, CA",
      deviceName: "MacBook Pro",
      success: true,
   },
   {
      id: "event-2",
      type: "password_change",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      ipAddress: "192.168.1.100",
      location: "San Francisco, CA",
      deviceName: "MacBook Pro",
      success: true,
   },
   {
      id: "event-3",
      type: "login",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      ipAddress: "203.0.113.0",
      location: "Unknown",
      deviceName: "Unknown Device",
      success: false,
   },
];

export const useUserStore = create<UserState>()(
   persist(
      (set, get) => ({
         // Initial state
         profile: null,
         preferences: null,
         sessions: [],
         securityEvents: [],
         isLoading: false,
         isUpdating: false,
         isUploadingAvatar: false,
         error: null,

         // Fetch profile
         fetchProfile: async () => {
            set({ isLoading: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 500));

               // In production, this would be: const response = await fetch('/api/user/profile')
               set({
                  profile: mockProfile,
                  isLoading: false,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to fetch profile",
                  isLoading: false,
               });
            }
         },

         // Update profile
         updateProfile: async (data) => {
            set({ isUpdating: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 800));

               // In production: const response = await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) })
               set((state) => ({
                  profile: state.profile
                     ? { ...state.profile, ...data, updatedAt: new Date() }
                     : null,
                  isUpdating: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to update profile",
                  isUpdating: false,
               });
               throw error;
            }
         },

         // Upload avatar
         uploadAvatar: async (file) => {
            set({ isUploadingAvatar: true, error: null });
            try {
               // Simulate file upload
               await new Promise((resolve) => setTimeout(resolve, 1500));

               // In production: const formData = new FormData(); formData.append('avatar', file); const response = await fetch('/api/user/avatar', { method: 'POST', body: formData })
               const avatarUrl = URL.createObjectURL(file);

               set((state) => ({
                  profile: state.profile
                     ? { ...state.profile, avatar: avatarUrl }
                     : null,
                  isUploadingAvatar: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to upload avatar",
                  isUploadingAvatar: false,
               });
               throw error;
            }
         },

         // Delete account
         deleteAccount: async () => {
            set({ isLoading: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 1000));

               // In production: await fetch('/api/user/account', { method: 'DELETE' })
               set({
                  profile: null,
                  preferences: null,
                  sessions: [],
                  securityEvents: [],
                  isLoading: false,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to delete account",
                  isLoading: false,
               });
               throw error;
            }
         },

         // Change password
         changePassword: async (oldPassword, newPassword) => {
            set({ isUpdating: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 1000));

               // In production: await fetch('/api/user/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) })

               // Add security event
               const newEvent: SecurityEvent = {
                  id: `event-${Date.now()}`,
                  type: "password_change",
                  timestamp: new Date(),
                  ipAddress: "192.168.1.100",
                  location: "Current Location",
                  deviceName: "Current Device",
                  success: true,
               };

               set((state) => ({
                  securityEvents: [newEvent, ...state.securityEvents],
                  isUpdating: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to change password",
                  isUpdating: false,
               });
               throw error;
            }
         },

         // Fetch sessions
         fetchSessions: async () => {
            set({ isLoading: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 500));

               // In production: const response = await fetch('/api/user/sessions')
               set({
                  sessions: mockSessions,
                  isLoading: false,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to fetch sessions",
                  isLoading: false,
               });
            }
         },

         // Logout session
         logoutSession: async (sessionId) => {
            set({ isUpdating: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 500));

               // In production: await fetch(`/api/user/sessions/${sessionId}`, { method: 'DELETE' })
               set((state) => ({
                  sessions: state.sessions.filter((s) => s.id !== sessionId),
                  isUpdating: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to logout session",
                  isUpdating: false,
               });
               throw error;
            }
         },

         // Logout all sessions
         logoutAllSessions: async () => {
            set({ isUpdating: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 800));

               // In production: await fetch('/api/user/sessions/all', { method: 'DELETE' })
               set((state) => ({
                  sessions: state.sessions.filter((s) => s.isCurrent),
                  isUpdating: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to logout all sessions",
                  isUpdating: false,
               });
               throw error;
            }
         },

         // Fetch security events
         fetchSecurityEvents: async () => {
            set({ isLoading: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 500));

               // In production: const response = await fetch('/api/user/security-events')
               set({
                  securityEvents: mockSecurityEvents,
                  isLoading: false,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to fetch security events",
                  isLoading: false,
               });
            }
         },

         // Fetch preferences
         fetchPreferences: async () => {
            set({ isLoading: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 500));

               // In production: const response = await fetch('/api/user/preferences')
               set({
                  preferences: defaultPreferences,
                  isLoading: false,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to fetch preferences",
                  isLoading: false,
               });
            }
         },

         // Update preferences
         updatePreferences: async (prefs) => {
            set({ isUpdating: true, error: null });
            try {
               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 500));

               // In production: await fetch('/api/user/preferences', { method: 'PUT', body: JSON.stringify(prefs) })
               set((state) => ({
                  preferences: state.preferences
                     ? { ...state.preferences, ...prefs }
                     : null,
                  isUpdating: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to update preferences",
                  isUpdating: false,
               });
               throw error;
            }
         },

         // Set theme
         setTheme: async (theme) => {
            set({ isUpdating: true, error: null });
            try {
               // Apply theme immediately for better UX
               document.documentElement.classList.remove("light", "dark");
               if (theme !== "system") {
                  document.documentElement.classList.add(theme);
               } else {
                  // Apply system preference
                  const systemTheme = window.matchMedia(
                     "(prefers-color-scheme: dark)"
                  ).matches
                     ? "dark"
                     : "light";
                  document.documentElement.classList.add(systemTheme);
               }

               // Simulate API call
               await new Promise((resolve) => setTimeout(resolve, 300));

               // In production: await fetch('/api/user/preferences', { method: 'PUT', body: JSON.stringify({ theme }) })
               set((state) => ({
                  preferences: state.preferences
                     ? { ...state.preferences, theme }
                     : null,
                  isUpdating: false,
               }));
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to set theme",
                  isUpdating: false,
               });
               throw error;
            }
         },

         // Clear error
         clearError: () => set({ error: null }),

         // Reset state
         reset: () =>
            set({
               profile: null,
               preferences: null,
               sessions: [],
               securityEvents: [],
               isLoading: false,
               isUpdating: false,
               isUploadingAvatar: false,
               error: null,
            }),
      }),
      {
         name: "user-store",
         partialize: (state) => ({
            preferences: state.preferences,
         }),
      }
   )
);
