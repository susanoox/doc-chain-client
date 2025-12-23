"use client";

import { FC } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Language = "en" | "es" | "fr" | "de" | "ja" | "zh" | "pt";

interface LanguageOption {
   value: Language;
   label: string;
   nativeName: string;
}

const languages: LanguageOption[] = [
   { value: "en", label: "English", nativeName: "English" },
   { value: "es", label: "Spanish", nativeName: "Español" },
   { value: "fr", label: "French", nativeName: "Français" },
   { value: "de", label: "German", nativeName: "Deutsch" },
   { value: "ja", label: "Japanese", nativeName: "日本語" },
   { value: "zh", label: "Chinese", nativeName: "中文" },
   { value: "pt", label: "Portuguese", nativeName: "Português" },
];

/**
 * LanguageSelector Component
 * Manages language preference selection
 * Follows Single Responsibility Principle - only handles language selection
 */
export const LanguageSelector: FC = () => {
   const { preferences, updatePreferences, isUpdating } = useUserStore();

   const currentLanguage = preferences?.language || "en";

   const handleLanguageChange = async (language: Language) => {
      if (language === currentLanguage) return;

      try {
         await updatePreferences({ language });
      } catch (error) {
         console.error("Failed to set language:", error);
      }
   };

   return (
      <div className='space-y-4'>
         <div>
            <Label className='text-base'>Language</Label>
            <p className='text-sm text-muted-foreground mt-1'>
               Select your preferred language
            </p>
         </div>

         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {languages.map((language) => {
               const isSelected = currentLanguage === language.value;

               return (
                  <button
                     key={language.value}
                     onClick={() => handleLanguageChange(language.value)}
                     disabled={isUpdating}
                     className={cn(
                        "relative p-4 border-2 rounded-lg transition-all hover:border-primary",
                        "flex items-center gap-3 text-left",
                        isSelected
                           ? "border-primary bg-primary/5"
                           : "border-border",
                        isUpdating && "opacity-50 cursor-not-allowed"
                     )}
                  >
                     {/* Icon */}
                     <div
                        className={cn(
                           "p-2 rounded-full",
                           isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        )}
                     >
                        <Globe size={20} />
                     </div>

                     {/* Language info */}
                     <div className='flex-1 min-w-0'>
                        <div className='font-semibold truncate'>
                           {language.nativeName}
                        </div>
                        <div className='text-xs text-muted-foreground truncate'>
                           {language.label}
                        </div>
                     </div>

                     {/* Selected indicator */}
                     {isSelected && (
                        <div className='shrink-0 p-1 bg-primary text-primary-foreground rounded-full'>
                           <Check size={14} />
                        </div>
                     )}
                  </button>
               );
            })}
         </div>
      </div>
   );
};
