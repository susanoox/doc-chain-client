"use client";

import { FC } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Label } from "@/components/ui/label";
import { Sparkles, Brain, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AISettings Component
 * Manages AI assistant preferences and settings
 * Follows Single Responsibility Principle - only handles AI configuration
 */
export const AISettings: FC = () => {
   const { preferences, updatePreferences, isUpdating } = useUserStore();

   const aiSettings = preferences?.ai || {
      enabled: true,
      suggestions: true,
      autoSummarize: false,
      autoTag: false,
   };

   const handleToggleAI = async () => {
      try {
         await updatePreferences({
            ai: { ...aiSettings, enabled: !aiSettings.enabled },
         });
      } catch (error) {
         console.error("Failed to toggle AI:", error);
      }
   };

   const handleToggleSuggestions = async () => {
      try {
         await updatePreferences({
            ai: { ...aiSettings, suggestions: !aiSettings.suggestions },
         });
      } catch (error) {
         console.error("Failed to toggle suggestions:", error);
      }
   };

   const handleToggleAutoSummarize = async () => {
      try {
         await updatePreferences({
            ai: { ...aiSettings, autoSummarize: !aiSettings.autoSummarize },
         });
      } catch (error) {
         console.error("Failed to toggle auto summarize:", error);
      }
   };

   const handleToggleAutoTag = async () => {
      try {
         await updatePreferences({
            ai: { ...aiSettings, autoTag: !aiSettings.autoTag },
         });
      } catch (error) {
         console.error("Failed to toggle auto tag:", error);
      }
   };

   return (
      <div className='space-y-8'>
         {/* AI Toggle */}
         <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div className='flex items-start gap-3'>
               <div className='p-2 rounded-full bg-primary/10 text-primary mt-1'>
                  <Sparkles size={18} />
               </div>
               <div>
                  <div className='font-medium'>AI Assistant</div>
                  <div className='text-sm text-muted-foreground'>
                     Enable AI-powered features and suggestions
                  </div>
               </div>
            </div>

            <button
               onClick={handleToggleAI}
               disabled={isUpdating}
               className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  aiSettings.enabled ? "bg-primary" : "bg-gray-200",
                  isUpdating && "opacity-50 cursor-not-allowed"
               )}
               role='switch'
               aria-checked={aiSettings.enabled}
            >
               <span
                  className={cn(
                     "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                     aiSettings.enabled ? "translate-x-5" : "translate-x-0.5"
                  )}
                  style={{ marginTop: "2px" }}
               />
            </button>
         </div>

         {aiSettings.enabled && (
            <div className='space-y-4'>
               <div>
                  <Label className='text-base'>AI Features</Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                     Configure AI-powered features
                  </p>
               </div>

               <div className='space-y-3'>
                  {/* Suggestions */}
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                     <div className='flex items-start gap-3'>
                        <div
                           className={cn(
                              "p-2 rounded-full mt-1",
                              aiSettings.suggestions
                                 ? "bg-primary/10 text-primary"
                                 : "bg-muted text-muted-foreground"
                           )}
                        >
                           <Brain size={18} />
                        </div>
                        <div>
                           <div className='font-medium'>AI Suggestions</div>
                           <div className='text-sm text-muted-foreground'>
                              Get intelligent suggestions while working
                           </div>
                        </div>
                     </div>

                     <button
                        onClick={handleToggleSuggestions}
                        disabled={isUpdating}
                        className={cn(
                           "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                           aiSettings.suggestions
                              ? "bg-primary"
                              : "bg-gray-200",
                           isUpdating && "opacity-50 cursor-not-allowed"
                        )}
                        role='switch'
                        aria-checked={aiSettings.suggestions}
                     >
                        <span
                           className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              aiSettings.suggestions
                                 ? "translate-x-5"
                                 : "translate-x-0.5"
                           )}
                           style={{ marginTop: "2px" }}
                        />
                     </button>
                  </div>

                  {/* Auto Summarize */}
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                     <div className='flex items-start gap-3'>
                        <div
                           className={cn(
                              "p-2 rounded-full mt-1",
                              aiSettings.autoSummarize
                                 ? "bg-primary/10 text-primary"
                                 : "bg-muted text-muted-foreground"
                           )}
                        >
                           <Zap size={18} />
                        </div>
                        <div>
                           <div className='font-medium'>Auto Summarize</div>
                           <div className='text-sm text-muted-foreground'>
                              Automatically generate document summaries
                           </div>
                        </div>
                     </div>

                     <button
                        onClick={handleToggleAutoSummarize}
                        disabled={isUpdating}
                        className={cn(
                           "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                           aiSettings.autoSummarize
                              ? "bg-primary"
                              : "bg-gray-200",
                           isUpdating && "opacity-50 cursor-not-allowed"
                        )}
                        role='switch'
                        aria-checked={aiSettings.autoSummarize}
                     >
                        <span
                           className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              aiSettings.autoSummarize
                                 ? "translate-x-5"
                                 : "translate-x-0.5"
                           )}
                           style={{ marginTop: "2px" }}
                        />
                     </button>
                  </div>

                  {/* Auto Tag */}
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                     <div className='flex items-start gap-3'>
                        <div
                           className={cn(
                              "p-2 rounded-full mt-1",
                              aiSettings.autoTag
                                 ? "bg-primary/10 text-primary"
                                 : "bg-muted text-muted-foreground"
                           )}
                        >
                           <Check size={18} />
                        </div>
                        <div>
                           <div className='font-medium'>Auto Tag</div>
                           <div className='text-sm text-muted-foreground'>
                              Automatically suggest tags for documents
                           </div>
                        </div>
                     </div>

                     <button
                        onClick={handleToggleAutoTag}
                        disabled={isUpdating}
                        className={cn(
                           "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                           aiSettings.autoTag ? "bg-primary" : "bg-gray-200",
                           isUpdating && "opacity-50 cursor-not-allowed"
                        )}
                        role='switch'
                        aria-checked={aiSettings.autoTag}
                     >
                        <span
                           className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              aiSettings.autoTag
                                 ? "translate-x-5"
                                 : "translate-x-0.5"
                           )}
                           style={{ marginTop: "2px" }}
                        />
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
