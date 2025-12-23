"use client";

import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ProfileForm } from "@/components/settings/profile/ProfileForm";
import { DeleteAccount } from "@/components/settings/profile/DeleteAccount";

/**
 * Profile Settings Page
 * Manages user profile information and account settings
 */
export default function ProfileSettingsPage() {
   return (
      <SettingsLayout>
         <div className='space-y-6'>
            <div>
               <h1 className='text-2xl font-bold'>Profile Settings</h1>
               <p className='text-muted-foreground mt-1'>
                  Manage your profile information and account
               </p>
            </div>

            <ProfileForm />

            <div className='pt-6 border-t'>
               <DeleteAccount />
            </div>
         </div>
      </SettingsLayout>
   );
}
