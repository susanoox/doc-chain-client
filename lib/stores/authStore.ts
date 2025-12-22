import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginCredentials, RegisterData } from "@/lib/types";

interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   error: string | null;

   // Actions
   login: (credentials: LoginCredentials) => Promise<void>;
   register: (data: RegisterData) => Promise<void>;
   logout: () => void;
   forgotPassword: (email: string) => Promise<void>;
   resetPassword: (token: string, newPassword: string) => Promise<void>;
   checkAuth: () => Promise<void>;
   clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         user: null,
         isAuthenticated: false,
         isLoading: false,
         error: null,

         login: async (credentials) => {
            set({ isLoading: true, error: null });
            try {
               // TODO: Replace with actual API call
               const response = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(credentials),
               });

               if (!response.ok) {
                  throw new Error("Login failed");
               }

               const { user, token } = await response.json();

               // Store token
               localStorage.setItem("token", token);

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error ? error.message : "Login failed",
                  isLoading: false,
               });
               throw error;
            }
         },

         register: async (data) => {
            set({ isLoading: true, error: null });
            try {
               // TODO: Replace with actual API call
               const response = await fetch("/api/auth/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
               });

               if (!response.ok) {
                  throw new Error("Registration failed");
               }

               const { user, token } = await response.json();

               // Store token
               localStorage.setItem("token", token);

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
               });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Registration failed",
                  isLoading: false,
               });
               throw error;
            }
         },

         logout: () => {
            localStorage.removeItem("token");
            set({
               user: null,
               isAuthenticated: false,
               error: null,
            });
         },

         forgotPassword: async (email) => {
            set({ isLoading: true, error: null });
            try {
               // TODO: Replace with actual API call
               await fetch("/api/auth/forgot-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
               });

               set({ isLoading: false });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to send reset email",
                  isLoading: false,
               });
               throw error;
            }
         },

         resetPassword: async (token, newPassword) => {
            set({ isLoading: true, error: null });
            try {
               // TODO: Replace with actual API call
               await fetch("/api/auth/reset-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token, newPassword }),
               });

               set({ isLoading: false });
            } catch (error) {
               set({
                  error:
                     error instanceof Error
                        ? error.message
                        : "Failed to reset password",
                  isLoading: false,
               });
               throw error;
            }
         },

         checkAuth: async () => {
            const token = localStorage.getItem("token");
            if (!token) {
               set({ isAuthenticated: false, user: null });
               return;
            }

            set({ isLoading: true });
            try {
               // TODO: Replace with actual API call
               const response = await fetch("/api/auth/me", {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });

               if (!response.ok) {
                  throw new Error("Invalid token");
               }

               const user = await response.json();

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
               });
            } catch (error) {
               localStorage.removeItem("token");
               set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
               });
            }
         },

         clearError: () => set({ error: null }),
      }),
      {
         name: "auth-storage",
         partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
         }),
      }
   )
);
