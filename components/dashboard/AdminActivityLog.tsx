"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   UserPlus,
   UserMinus,
   Shield,
   AlertTriangle,
   CheckCircle2,
   Clock,
   ChevronRight,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface AdminActivity {
   id: string;
   type: "user_add" | "user_remove" | "security" | "system" | "blockchain";
   user: string;
   action: string;
   description: string;
   timestamp: Date;
   severity: "low" | "medium" | "high";
}

const mockActivities: AdminActivity[] = [
   {
      id: "1",
      type: "user_add",
      user: "John Doe",
      action: "User registered",
      description: "New user john.doe@example.com registered",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      severity: "low",
   },
   {
      id: "2",
      type: "security",
      user: "System",
      action: "Security scan completed",
      description: "No vulnerabilities detected",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      severity: "low",
   },
   {
      id: "3",
      type: "blockchain",
      user: "System",
      action: "Blockchain sync",
      description: "Synchronized 50 documents with blockchain",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      severity: "low",
   },
   {
      id: "4",
      type: "user_remove",
      user: "Admin",
      action: "User account suspended",
      description: "Suspended user@example.com for policy violation",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      severity: "medium",
   },
];

export const AdminActivityLog = () => {
   const getActivityIcon = (type: string) => {
      switch (type) {
         case "user_add":
            return <UserPlus size={16} />;
         case "user_remove":
            return <UserMinus size={16} />;
         case "security":
            return <Shield size={16} />;
         case "blockchain":
            return <CheckCircle2 size={16} />;
         default:
            return <Clock size={16} />;
      }
   };

   const getSeverityColor = (severity: string) => {
      switch (severity) {
         case "high":
            return "bg-[var(--error)]/10 text-[var(--error)]";
         case "medium":
            return "bg-[var(--warning)]/10 text-[var(--warning)]";
         default:
            return "bg-[var(--info)]/10 text-[var(--info)]";
      }
   };

   const getSeverityBadge = (severity: string) => {
      switch (severity) {
         case "high":
            return "destructive";
         case "medium":
            return "secondary";
         default:
            return "outline";
      }
   };

   return (
      <Card className='p-6'>
         <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Admin Activity Log</h2>
            <Button variant='ghost' size='sm'>
               View All
               <ChevronRight size={16} className='ml-1' />
            </Button>
         </div>

         <div className='space-y-3'>
            {mockActivities.map((activity) => (
               <div
                  key={activity.id}
                  className='p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
               >
                  <div className='flex items-start gap-3'>
                     <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getSeverityColor(
                           activity.severity
                        )}`}
                     >
                        {getActivityIcon(activity.type)}
                     </div>
                     <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2'>
                           <div>
                              <p className='text-sm font-medium'>
                                 {activity.action}
                              </p>
                              <p className='text-xs text-muted-foreground mt-0.5'>
                                 by {activity.user}
                              </p>
                           </div>
                           <Badge
                              variant={
                                 getSeverityBadge(activity.severity) as any
                              }
                              className='text-xs'
                           >
                              {activity.severity}
                           </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground mt-2'>
                           {activity.description}
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                           {formatRelativeTime(activity.timestamp)}
                        </p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </Card>
   );
};
