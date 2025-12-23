"use client";

import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ChangePassword } from "@/components/settings/security/ChangePassword";
import { SessionsList } from "@/components/settings/security/SessionsList";
import { SecurityLog } from "@/components/settings/security/SecurityLog";

/**
 * Security Settings Page
 * Manages security settings, sessions, and activity logs
 */
export default function SecuritySettingsPage() {
   return (
      <SettingsLayout>
         <div className='space-y-6'>
            <div>
               <h1 className='text-2xl font-bold'>Security Settings</h1>
               <p className='text-muted-foreground mt-1'>
                  Manage your account security and active sessions
               </p>
            </div>

            <ChangePassword />

            <div className='pt-6 border-t'>
               <SessionsList />
            </div>

            <div className='pt-6 border-t'>
               <SecurityLog />
            </div>
         </div>
      </SettingsLayout>
   );
}
