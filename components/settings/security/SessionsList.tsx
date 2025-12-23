"use client";

import { FC, useEffect } from "react";
import { useUserStore, Session } from "@/lib/stores/userStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Monitor,
   Smartphone,
   Tablet,
   MapPin,
   Clock,
   LogOut,
   Loader2,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

/**
 * SessionsList Component
 * Displays active sessions with logout capability
 * Follows Single Responsibility Principle - only handles session management
 */
export const SessionsList: FC = () => {
   const {
      sessions,
      isLoading,
      isUpdating,
      fetchSessions,
      logoutSession,
      logoutAllSessions,
   } = useUserStore();

   useEffect(() => {
      fetchSessions();
   }, [fetchSessions]);

   const getDeviceIcon = (type: Session["deviceType"]) => {
      switch (type) {
         case "desktop":
            return <Monitor size={20} />;
         case "mobile":
            return <Smartphone size={20} />;
         case "tablet":
            return <Tablet size={20} />;
         default:
            return <Monitor size={20} />;
      }
   };

   const handleLogoutSession = async (sessionId: string) => {
      if (window.confirm("Are you sure you want to log out this session?")) {
         try {
            await logoutSession(sessionId);
         } catch (error) {
            console.error("Failed to logout session:", error);
         }
      }
   };

   const handleLogoutAll = async () => {
      if (
         window.confirm(
            "Are you sure you want to log out all other sessions? This will end all sessions except your current one."
         )
      ) {
         try {
            await logoutAllSessions();
         } catch (error) {
            console.error("Failed to logout all sessions:", error);
         }
      }
   };

   if (isLoading) {
      return (
         <div className='flex items-center justify-center h-48'>
            <Loader2 size={32} className='animate-spin text-muted-foreground' />
         </div>
      );
   }

   const otherSessions = sessions.filter((s) => !s.isCurrent);

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h3 className='text-lg font-semibold'>Active Sessions</h3>
               <p className='text-sm text-muted-foreground'>
                  Manage devices where you're currently logged in
               </p>
            </div>

            {otherSessions.length > 0 && (
               <Button
                  variant='outline'
                  size='sm'
                  onClick={handleLogoutAll}
                  disabled={isUpdating}
               >
                  <LogOut size={16} className='mr-2' />
                  Logout All Others
               </Button>
            )}
         </div>

         {/* Sessions list */}
         <div className='space-y-3'>
            {sessions.length === 0 ? (
               <div className='text-center py-8 text-muted-foreground'>
                  No active sessions found
               </div>
            ) : (
               sessions.map((session) => (
                  <div
                     key={session.id}
                     className='flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors'
                  >
                     {/* Device icon */}
                     <div className='shrink-0 p-2 bg-primary/10 rounded-lg text-primary'>
                        {getDeviceIcon(session.deviceType)}
                     </div>

                     {/* Session info */}
                     <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                           <h4 className='font-medium'>{session.deviceName}</h4>
                           {session.isCurrent && (
                              <Badge variant='default' className='text-xs'>
                                 Current
                              </Badge>
                           )}
                        </div>

                        <div className='space-y-1 text-sm text-muted-foreground'>
                           <div className='flex items-center gap-2'>
                              <Monitor size={14} />
                              <span>{session.browser}</span>
                           </div>
                           <div className='flex items-center gap-2'>
                              <MapPin size={14} />
                              <span>
                                 {session.location} • {session.ipAddress}
                              </span>
                           </div>
                           <div className='flex items-center gap-2'>
                              <Clock size={14} />
                              <span>
                                 Last active{" "}
                                 {formatRelativeTime(session.lastActive)}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Actions */}
                     {!session.isCurrent && (
                        <Button
                           variant='ghost'
                           size='sm'
                           onClick={() => handleLogoutSession(session.id)}
                           disabled={isUpdating}
                        >
                           <LogOut size={16} />
                        </Button>
                     )}
                  </div>
               ))
            )}
         </div>

         {/* Info */}
         <div className='p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground'>
            <p>
               <strong>Tip:</strong> If you see a session you don't recognize,
               log it out immediately and change your password.
            </p>
         </div>
      </div>
   );
};
