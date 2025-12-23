"use client";

import { FC, useEffect } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface ThemeOption {
   value: Theme;
   label: string;
   description: string;
   icon: React.ReactNode;
}

const themes: ThemeOption[] = [
   {
      value: "light",
      label: "Light",
      description: "Light mode",
      icon: <Sun size={24} />,
   },
   {
      value: "dark",
      label: "Dark",
      description: "Dark mode",
      icon: <Moon size={24} />,
   },
   {
      value: "system",
      label: "System",
      description: "Use system preference",
      icon: <Monitor size={24} />,
   },
];

/**
 * ThemeSelector Component
 * Handles theme selection and application
 * Follows Single Responsibility Principle - only handles theme management
 */
export const ThemeSelector: FC = () => {
   const { preferences, setTheme, isUpdating } = useUserStore();

   const currentTheme = preferences?.theme || "system";

   const handleThemeChange = async (theme: Theme) => {
      try {
         await setTheme(theme);
      } catch (error) {
         console.error("Failed to set theme:", error);
      }
   };

   return (
      <div className='space-y-4'>
         <div>
            <Label className='text-base'>Theme</Label>
            <p className='text-sm text-muted-foreground mt-1'>
               Choose how DocChain looks to you
            </p>
         </div>

         <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {themes.map((theme) => {
               const isSelected = currentTheme === theme.value;

               return (
                  <button
                     key={theme.value}
                     onClick={() => handleThemeChange(theme.value)}
                     disabled={isUpdating}
                     className={cn(
                        "relative p-6 border-2 rounded-lg transition-all hover:border-primary",
                        "flex flex-col items-center gap-3 text-center",
                        isSelected
                           ? "border-primary bg-primary/5"
                           : "border-border",
                        isUpdating && "opacity-50 cursor-not-allowed"
                     )}
                  >
                     {/* Icon */}
                     <div
                        className={cn(
                           "p-4 rounded-full",
                           isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        )}
                     >
                        {theme.icon}
                     </div>

                     {/* Label */}
                     <div>
                        <div className='font-semibold mb-1'>{theme.label}</div>
                        <div className='text-xs text-muted-foreground'>
                           {theme.description}
                        </div>
                     </div>

                     {/* Selected indicator */}
                     {isSelected && (
                        <div className='absolute top-3 right-3 p-1 bg-primary text-primary-foreground rounded-full'>
                           <Check size={16} />
                        </div>
                     )}
                  </button>
               );
            })}
         </div>
      </div>
   );
};
