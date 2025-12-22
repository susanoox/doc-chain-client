"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
   Users,
   FileText,
   HardDrive,
   Activity,
   TrendingUp,
   AlertCircle,
   CheckCircle2,
   Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemMetric {
   label: string;
   value: string | number;
   change?: {
      value: number;
      isPositive: boolean;
   };
   icon: React.ReactNode;
   color: string;
}

export const SystemOverview = () => {
   const systemMetrics: SystemMetric[] = [
      {
         label: "Total Users",
         value: 156,
         change: { value: 12, isPositive: true },
         icon: <Users size={20} />,
         color: "text-[var(--info)]",
      },
      {
         label: "Total Documents",
         value: "2,453",
         change: { value: 8, isPositive: true },
         icon: <FileText size={20} />,
         color: "text-[var(--success)]",
      },
      {
         label: "Storage Used",
         value: "245 GB",
         change: { value: 15, isPositive: false },
         icon: <HardDrive size={20} />,
         color: "text-[var(--warning)]",
      },
      {
         label: "System Uptime",
         value: "99.8%",
         change: { value: 0.2, isPositive: true },
         icon: <Activity size={20} />,
         color: "text-[var(--success)]",
      },
   ];

   return (
      <Card className='p-6'>
         <h2 className='text-xl font-semibold mb-4'>System Overview</h2>

         {/* Metrics Grid */}
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            {systemMetrics.map((metric, index) => (
               <div key={index} className='p-4 rounded-lg border bg-card'>
                  <div className='flex items-center justify-between mb-2'>
                     <span
                        className={cn("p-2 rounded-lg bg-muted", metric.color)}
                     >
                        {metric.icon}
                     </span>
                     {metric.change && (
                        <span
                           className={cn(
                              "text-xs font-medium flex items-center gap-1",
                              metric.change.isPositive
                                 ? "text-[var(--success)]"
                                 : "text-[var(--error)]"
                           )}
                        >
                           <TrendingUp
                              size={12}
                              className={cn(
                                 !metric.change.isPositive && "rotate-180"
                              )}
                           />
                           {metric.change.value}%
                        </span>
                     )}
                  </div>
                  <p className='text-2xl font-bold'>{metric.value}</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                     {metric.label}
                  </p>
               </div>
            ))}
         </div>

         {/* Storage Usage */}
         <div className='space-y-2 mb-6'>
            <div className='flex items-center justify-between text-sm'>
               <span className='text-muted-foreground'>Storage Usage</span>
               <span className='font-medium'>245 GB / 500 GB</span>
            </div>
            <Progress value={49} className='h-2' />
            <p className='text-xs text-muted-foreground'>
               49% used · 255 GB remaining
            </p>
         </div>

         {/* System Health Indicators */}
         <div className='space-y-3'>
            <h3 className='text-sm font-medium'>System Health</h3>

            <div className='flex items-center justify-between p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20'>
               <div className='flex items-center gap-2'>
                  <CheckCircle2 size={16} className='text-[var(--success)]' />
                  <span className='text-sm font-medium'>API Services</span>
               </div>
               <Badge
                  variant='outline'
                  className='text-[var(--success)] border-[var(--success)]'
               >
                  Operational
               </Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20'>
               <div className='flex items-center gap-2'>
                  <CheckCircle2 size={16} className='text-[var(--success)]' />
                  <span className='text-sm font-medium'>
                     Blockchain Network
                  </span>
               </div>
               <Badge
                  variant='outline'
                  className='text-[var(--success)] border-[var(--success)]'
               >
                  Connected
               </Badge>
            </div>

            <div className='flex items-center justify-between p-3 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/20'>
               <div className='flex items-center gap-2'>
                  <Clock size={16} className='text-[var(--warning)]' />
                  <span className='text-sm font-medium'>Backup Service</span>
               </div>
               <Badge
                  variant='outline'
                  className='text-[var(--warning)] border-[var(--warning)]'
               >
                  In Progress
               </Badge>
            </div>
         </div>
      </Card>
   );
};
