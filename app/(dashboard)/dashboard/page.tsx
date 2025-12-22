"use client";

import {
   DashboardHeader,
   StatsCard,
   QuickActions,
   RecentActivity,
   AISuggestions,
   BlockchainStats,
} from "@/components/dashboard";
import { FileText, Share2, Shield, BrainCircuit } from "lucide-react";

export default function DashboardPage() {
   return (
      <div className='space-y-6'>
         {/* Header with personalized greeting */}
         <DashboardHeader showGreeting />

         {/* Stats Grid */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
               title='Total Documents'
               value={24}
               icon={<FileText size={24} />}
               trend={{ value: 12, label: "from last month", direction: "up" }}
            />
            <StatsCard
               title='Shared'
               value={12}
               icon={<Share2 size={24} />}
               trend={{ value: 0, label: "50% of total", direction: "neutral" }}
               variant='default'
            />
            <StatsCard
               title='Protected'
               value='100%'
               icon={<Shield size={24} />}
               trend={{ value: 0, label: "All secured", direction: "up" }}
               variant='blockchain'
            />
            <StatsCard
               title='AI Insights'
               value={8}
               icon={<BrainCircuit size={24} />}
               trend={{ value: 3, label: "new suggestions", direction: "up" }}
               variant='ai'
            />
         </div>

         {/* Quick Actions */}
         <QuickActions />

         {/* Main Content Grid */}
         <div className='grid gap-6 lg:grid-cols-3'>
            {/* Recent Activity - Takes 2 columns */}
            <div className='lg:col-span-2'>
               <RecentActivity />
            </div>

            {/* Blockchain Stats - Takes 1 column */}
            <div>
               <BlockchainStats />
            </div>
         </div>

         {/* AI Suggestions */}
         <AISuggestions />
      </div>
   );
}
