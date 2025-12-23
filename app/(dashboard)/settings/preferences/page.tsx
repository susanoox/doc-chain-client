"use client";

import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ThemeSelector } from "@/components/settings/preferences/ThemeSelector";
import { LanguageSelector } from "@/components/settings/preferences/LanguageSelector";
import { NotificationSettings } from "@/components/settings/preferences/NotificationSettings";
import { AISettings } from "@/components/settings/preferences/AISettings";

/**
 * Preferences Settings Page
 * Manages user preferences including theme, language, notifications, and AI settings
 */
export default function PreferencesSettingsPage() {
   return (
      <SettingsLayout>
         <div className='space-y-8'>
            <div>
               <h1 className='text-2xl font-bold'>Preferences</h1>
               <p className='text-muted-foreground mt-1'>
                  Customize your DocChain experience
               </p>
            </div>

            <ThemeSelector />

            <div className='pt-6 border-t'>
               <LanguageSelector />
            </div>

            <div className='pt-6 border-t'>
               <NotificationSettings />
            </div>

            <div className='pt-6 border-t'>
               <AISettings />
            </div>
         </div>
      </SettingsLayout>
   );
}
