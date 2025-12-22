"use client";

import { FC } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface DashboardHeaderProps {
   title?: string;
   subtitle?: string;
   showGreeting?: boolean;
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
   title,
   subtitle,
   showGreeting = true,
}) => {
   const { user } = useAuth();

   const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
   };

   const displayTitle =
      title ||
      (showGreeting && user
         ? `${getGreeting()}, ${user.name.split(" ")[0]}`
         : "Dashboard");
   const displaySubtitle =
      subtitle ||
      "Welcome to DocChain - Your blockchain-secured document management system";

   return (
      <div className='mb-6'>
         <h1 className='text-3xl font-bold tracking-tight'>{displayTitle}</h1>
         <p className='text-muted-foreground mt-2'>{displaySubtitle}</p>
      </div>
   );
};
