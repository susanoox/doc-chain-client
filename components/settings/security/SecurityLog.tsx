"use client";

import { FC, useEffect } from "react";
import { useUserStore, SecurityEvent } from "@/lib/stores/userStore";
import { Badge } from "@/components/ui/badge";
import {
   Shield,
   LogIn,
   LogOut,
   Key,
   ShieldCheck,
   ShieldOff,
   UserX,
   Clock,
   MapPin,
   Monitor,
   Loader2,
   CheckCircle2,
   XCircle,
} from "lucide-react";
import { format } from "date-fns";

/**
 * SecurityLog Component
 * Displays security events and audit trail
 * Follows Single Responsibility Principle - only handles security log display
 */
export const SecurityLog: FC = () => {
   const { securityEvents, isLoading, fetchSecurityEvents } = useUserStore();

   useEffect(() => {
      fetchSecurityEvents();
   }, [fetchSecurityEvents]);

   const getEventIcon = (type: SecurityEvent["type"]) => {
      switch (type) {
         case "login":
            return <LogIn size={16} />;
         case "logout":
            return <LogOut size={16} />;
         case "password_change":
            return <Key size={16} />;
         case "mfa_enabled":
            return <ShieldCheck size={16} />;
         case "mfa_disabled":
            return <ShieldOff size={16} />;
         case "session_revoked":
            return <UserX size={16} />;
         default:
            return <Shield size={16} />;
      }
   };

   const getEventLabel = (type: SecurityEvent["type"]) => {
      switch (type) {
         case "login":
            return "Signed in";
         case "logout":
            return "Signed out";
         case "password_change":
            return "Password changed";
         case "mfa_enabled":
            return "Two-factor authentication enabled";
         case "mfa_disabled":
            return "Two-factor authentication disabled";
         case "session_revoked":
            return "Session revoked";
         default:
            return "Security event";
      }
   };

   const getEventColor = (type: SecurityEvent["type"], success: boolean) => {
      if (!success) return "text-destructive";

      switch (type) {
         case "password_change":
         case "mfa_enabled":
            return "text-green-600";
         case "mfa_disabled":
         case "session_revoked":
            return "text-orange-600";
         default:
            return "text-primary";
      }
   };

   if (isLoading) {
      return (
         <div className='flex items-center justify-center h-48'>
            <Loader2 size={32} className='animate-spin text-muted-foreground' />
         </div>
      );
   }

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div>
            <h3 className='text-lg font-semibold'>Security Log</h3>
            <p className='text-sm text-muted-foreground'>
               Recent security events and account activity
            </p>
         </div>

         {/* Events list */}
         <div className='space-y-3'>
            {securityEvents.length === 0 ? (
               <div className='text-center py-8 text-muted-foreground'>
                  No security events recorded
               </div>
            ) : (
               securityEvents.map((event) => (
                  <div
                     key={event.id}
                     className='flex items-start gap-4 p-4 border rounded-lg'
                  >
                     {/* Event icon */}
                     <div
                        className={`shrink-0 p-2 rounded-lg ${
                           event.success ? "bg-primary/10" : "bg-destructive/10"
                        } ${getEventColor(event.type, event.success)}`}
                     >
                        {getEventIcon(event.type)}
                     </div>

                     {/* Event details */}
                     <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                           <h4 className='font-medium'>
                              {getEventLabel(event.type)}
                           </h4>
                           <Badge
                              variant={
                                 event.success ? "default" : "destructive"
                              }
                              className='text-xs'
                           >
                              {event.success ? (
                                 <>
                                    <CheckCircle2 size={12} className='mr-1' />{" "}
                                    Success
                                 </>
                              ) : (
                                 <>
                                    <XCircle size={12} className='mr-1' />{" "}
                                    Failed
                                 </>
                              )}
                           </Badge>
                        </div>

                        <div className='space-y-1 text-sm text-muted-foreground'>
                           <div className='flex items-center gap-2'>
                              <Clock size={14} />
                              <span>
                                 {format(
                                    new Date(event.timestamp),
                                    "MMM dd, yyyy 'at' hh:mm a"
                                 )}
                              </span>
                           </div>
                           <div className='flex items-center gap-2'>
                              <Monitor size={14} />
                              <span>{event.deviceName}</span>
                           </div>
                           <div className='flex items-center gap-2'>
                              <MapPin size={14} />
                              <span>
                                 {event.location} • {event.ipAddress}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Info */}
         <div className='p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground'>
            <p>
               <strong>Note:</strong> Security events are logged automatically
               and help you monitor account activity. If you notice any
               suspicious activity, change your password immediately.
            </p>
         </div>
      </div>
   );
};
