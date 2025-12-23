"use client";

import { FC } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationOption {
   key: keyof NonNullable<
      ReturnType<typeof useUserStore.getState>["preferences"]
   >["notifications"];
   label: string;
   description: string;
}

const notificationOptions: NotificationOption[] = [
   {
      key: "email",
      label: "Email Notifications",
      description: "Receive notifications via email",
   },
   {
      key: "push",
      label: "Push Notifications",
      description: "Receive push notifications in your browser",
   },
   {
      key: "documentShared",
      label: "Document Shared",
      description: "When someone shares a document with you",
   },
   {
      key: "documentVerified",
      label: "Document Verified",
      description: "When a document is verified on blockchain",
   },
   {
      key: "securityAlerts",
      label: "Security Alerts",
      description: "Security-related notifications",
   },
];

/**
 * NotificationSettings Component
 * Manages notification preferences
 * Follows Single Responsibility Principle - only handles notification settings
 */
export const NotificationSettings: FC = () => {
   const { preferences, updatePreferences, isUpdating } = useUserStore();

   const notifications = preferences?.notifications || {
      email: true,
      push: false,
      documentShared: true,
      documentVerified: false,
      securityAlerts: true,
   };

   const handleToggle = async (
      key: keyof typeof notifications,
      value: boolean
   ) => {
      try {
         await updatePreferences({
            notifications: {
               ...notifications,
               [key]: value,
            },
         });
      } catch (error) {
         console.error("Failed to update notification settings:", error);
      }
   };

   return (
      <div className='space-y-6'>
         <div>
            <Label className='text-base'>Notifications</Label>
            <p className='text-sm text-muted-foreground mt-1'>
               Manage how you receive notifications
            </p>
         </div>

         <div className='space-y-4'>
            {notificationOptions.map((option) => {
               const isEnabled = notifications[option.key];

               return (
                  <div
                     key={option.key}
                     className='flex items-center justify-between gap-4 p-4 border rounded-lg'
                  >
                     {/* Left: Icon + Text */}
                     <div className='flex items-start gap-3 flex-1 min-w-0'>
                        <div
                           className={cn(
                              "p-2 rounded-full mt-1",
                              isEnabled
                                 ? "bg-primary/10 text-primary"
                                 : "bg-muted text-muted-foreground"
                           )}
                        >
                           {isEnabled ? (
                              <Bell size={18} />
                           ) : (
                              <BellOff size={18} />
                           )}
                        </div>

                        <div className='flex-1 min-w-0'>
                           <div className='font-medium'>{option.label}</div>
                           <div className='text-sm text-muted-foreground'>
                              {option.description}
                           </div>
                        </div>
                     </div>

                     {/* Right: Toggle */}
                     <button
                        onClick={() => handleToggle(option.key, !isEnabled)}
                        disabled={isUpdating}
                        className={cn(
                           "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                           isEnabled ? "bg-primary" : "bg-gray-200",
                           isUpdating && "opacity-50 cursor-not-allowed"
                        )}
                        role='switch'
                        aria-checked={isEnabled}
                     >
                        <span
                           className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              isEnabled ? "translate-x-5" : "translate-x-0.5"
                           )}
                           style={{ marginTop: "2px" }}
                        />
                     </button>
                  </div>
               );
            })}
         </div>
      </div>
   );
};
