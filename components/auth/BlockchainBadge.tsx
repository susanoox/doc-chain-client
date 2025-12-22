"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

interface BlockchainBadgeProps {
   size?: "sm" | "md" | "lg";
   showText?: boolean;
   className?: string;
}

export const BlockchainBadge: FC<BlockchainBadgeProps> = ({
   size = "md",
   showText = true,
   className,
}) => {
   const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
   };

   const textSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
   };

   return (
      <div
         className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
            "bg-blockchain/10 border border-blockchain/20",
            "text-blockchain",
            className
         )}
      >
         <svg
            className={cn(sizeClasses[size], "animate-blockchain-pulse")}
            fill='currentColor'
            viewBox='0 0 24 24'
         >
            <path d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V9.99h7V2.95l8 4v10.01c0 .66-.04 1.32-.12 1.97H12v-6.94z' />
         </svg>
         {showText && (
            <span className={cn("font-medium", textSizeClasses[size])}>
               Blockchain Protected
            </span>
         )}
      </div>
   );
};
