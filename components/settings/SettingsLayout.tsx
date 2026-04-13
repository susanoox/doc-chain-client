"use client";

import { FC, ReactNode, useEffect } from "react";
import { SettingsSidebar } from "./SettingsSidebar";
import { useUserStore } from "@/lib/stores/userStore";

interface SettingsLayoutProps {
   children: ReactNode;
}

/**
 * SettingsLayout Component
 * Layout wrapper for settings pages with sidebar navigation
 * Follows Single Responsibility Principle - only handles settings layout structure
 */
export const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
   const { fetchProfile, fetchPreferences } = useUserStore();

   useEffect(() => {
      fetchProfile();
      fetchPreferences();
   }, [fetchProfile, fetchPreferences]);

   return (
      <div className='container mx-auto p-6 max-w-7xl'>
         <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar navigation */}
            <SettingsSidebar className='lg:sticky lg:top-6 lg:self-start' />

            {/* Main content */}
            <main className='flex-1 min-w-0'>
               <div className='bg-card border rounded-lg p-6'>{children}</div>
            </main>
         </div>
      </div>
   );
};
