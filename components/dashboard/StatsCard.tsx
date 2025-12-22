"use client";

import { FC, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatsCardProps {
   title: string;
   value: string | number;
   icon: ReactNode;
   trend?: {
      value: number;
      label: string;
      direction: "up" | "down" | "neutral";
   };
   variant?: "default" | "blockchain" | "ai" | "success" | "warning" | "error";
   className?: string;
}

export const StatsCard: FC<StatsCardProps> = ({
   title,
   value,
   icon,
   trend,
   variant = "default",
   className,
}) => {
   const getTrendIcon = () => {
      if (!trend) return null;

      switch (trend.direction) {
         case "up":
            return <TrendingUp size={14} />;
         case "down":
            return <TrendingDown size={14} />;
         default:
            return <Minus size={14} />;
      }
   };

   const getTrendColor = () => {
      if (!trend) return "";

      switch (trend.direction) {
         case "up":
            return "text-(--success)";
         case "down":
            return "text-(--error)";
         default:
            return "text-muted-foreground";
      }
   };

   const getVariantStyles = () => {
      switch (variant) {
         case "blockchain":
            return "border-blockchain/20 bg-blockchain/5";
         case "ai":
            return "border-ai/20 bg-ai/5";
         case "success":
            return "border-(--success)/20 bg-(--success)/5";
         case "warning":
            return "border-(--warning)/20 bg-(--warning)/5";
         case "error":
            return "border-(--error)/20 bg-(--error)/5";
         default:
            return "";
      }
   };

   return (
      <Card
         className={cn(
            "p-6 transition-all hover:shadow-md",
            getVariantStyles(),
            className
         )}
      >
         <div className='flex items-start justify-between'>
            <div className='flex-1'>
               <p className='text-sm font-medium text-muted-foreground'>
                  {title}
               </p>
               <p className='text-3xl font-bold mt-2'>{value}</p>
               {trend && (
                  <div
                     className={cn(
                        "flex items-center gap-1 mt-2 text-xs font-medium",
                        getTrendColor()
                     )}
                  >
                     {getTrendIcon()}
                     <span>
                        {Math.abs(trend.value)}% {trend.label}
                     </span>
                  </div>
               )}
            </div>
            <div
               className={cn(
                  "p-3 rounded-lg",
                  variant === "blockchain" &&
                     "bg-blockchain/10 text-blockchain",
                  variant === "ai" && "bg-ai/10 text-ai",
                  variant === "success" && "bg-(--success)/10 text-(--success)",
                  variant === "warning" && "bg-(--warning)/10 text-(--warning)",
                  variant === "error" && "bg-(--error)/10 text-(--error)",
                  variant === "default" && "bg-primary/10 text-primary"
               )}
            >
               {icon}
            </div>
         </div>
      </Card>
   );
};
