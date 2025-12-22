"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Activity } from "@/lib/types/common";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
   FileUp,
   Share2,
   Shield,
   FileText,
   Trash2,
   Lock,
   Unlock,
   UserPlus,
   Settings,
} from "lucide-react";

interface RecentActivityProps {
   activities?: Activity[];
   maxItems?: number;
}

// Mock activities - will be replaced with real data
const mockActivities: Activity[] = [
   {
      id: "1",
      type: "upload",
      message: "Document uploaded",
      description: "Contract.pdf was successfully uploaded",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      userId: "user1",
      userName: "Current User",
      metadata: { fileName: "Contract.pdf" },
   },
   {
      id: "2",
      type: "share",
      message: "Document shared",
      description: "Proposal.pdf shared with john@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      userId: "user1",
      userName: "Current User",
      metadata: { fileName: "Proposal.pdf", sharedWith: "john@example.com" },
   },
   {
      id: "3",
      type: "blockchain_verify",
      message: "Blockchain verification",
      description: "Report.docx verified on blockchain",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      userId: "user1",
      userName: "Current User",
      metadata: { fileName: "Report.docx" },
   },
];

const activityIcons: Record<string, React.ReactNode> = {
   upload: <FileUp size={16} />,
   share: <Share2 size={16} />,
   blockchain_verify: <Shield size={16} />,
   edit: <FileText size={16} />,
   delete: <Trash2 size={16} />,
   protect: <Lock size={16} />,
   unprotect: <Unlock size={16} />,
   user_add: <UserPlus size={16} />,
   settings: <Settings size={16} />,
};

const activityColors: Record<string, string> = {
   upload: "bg-[var(--success)]/10 text-[var(--success)]",
   share: "bg-[var(--info)]/10 text-[var(--info)]",
   blockchain_verify: "bg-blockchain/10 text-blockchain",
   edit: "bg-[var(--warning)]/10 text-[var(--warning)]",
   delete: "bg-[var(--error)]/10 text-[var(--error)]",
   protect: "bg-blockchain/10 text-blockchain",
   unprotect: "bg-[var(--warning)]/10 text-[var(--warning)]",
   user_add: "bg-[var(--success)]/10 text-[var(--success)]",
   settings: "bg-[var(--info)]/10 text-[var(--info)]",
};

export const RecentActivity: FC<RecentActivityProps> = ({
   activities = mockActivities,
   maxItems = 5,
}) => {
   const displayActivities = activities.slice(0, maxItems);

   return (
      <Card className='p-6'>
         <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
         <div className='space-y-4'>
            {displayActivities.length === 0 ? (
               <p className='text-sm text-muted-foreground text-center py-8'>
                  No recent activity
               </p>
            ) : (
               displayActivities.map((activity, index) => (
                  <div
                     key={activity.id}
                     className={cn(
                        "flex items-start gap-3 pb-4",
                        index !== displayActivities.length - 1 && "border-b"
                     )}
                  >
                     <div
                        className={cn(
                           "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                           activityColors[activity.type] ||
                              activityColors.settings
                        )}
                     >
                        {activityIcons[activity.type] || activityIcons.settings}
                     </div>
                     <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium'>
                           {activity.message}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>
                           {activity.description}
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                           {formatRelativeTime(activity.timestamp)}
                        </p>
                     </div>
                  </div>
               ))
            )}
         </div>
      </Card>
   );
};
