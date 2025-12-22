"use client";

import { FC, useMemo } from "react";
import { validatePassword } from "@/lib/utils/validation";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
   password: string;
   showFeedback?: boolean;
}

export const PasswordStrengthMeter: FC<PasswordStrengthMeterProps> = ({
   password,
   showFeedback = true,
}) => {
   const validation = useMemo(() => validatePassword(password), [password]);

   if (!password) return null;

   const getStrengthColor = (score: number) => {
      if (score < 2) return "bg-(--error)";
      if (score < 3) return "bg-(--warning)";
      if (score < 4) return "bg-(--info)";
      return "bg-(--success)";
   };

   const getStrengthText = (score: number) => {
      if (score < 2) return "Weak";
      if (score < 3) return "Fair";
      if (score < 4) return "Good";
      return "Strong";
   };

   return (
      <div className='space-y-2'>
         {/* Strength bar */}
         <div className='flex gap-1'>
            {[...Array(4)].map((_, index) => (
               <div
                  key={index}
                  className={cn(
                     "h-1 flex-1 rounded-full transition-all duration-300",
                     index < validation.score
                        ? getStrengthColor(validation.score)
                        : "bg-muted"
                  )}
               />
            ))}
         </div>

         {/* Strength text */}
         <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>
               Password strength:{" "}
               <span
                  className={cn(
                     "font-medium",
                     validation.score < 2 && "text-(--error)",
                     validation.score === 2 && "text-(--warning)",
                     validation.score === 3 && "text-(--info)",
                     validation.score === 4 && "text-(--success)"
                  )}
               >
                  {getStrengthText(validation.score)}
               </span>
            </span>
            {validation.isValid && (
               <svg
                  className='w-4 h-4 text-(--success)'
                  fill='currentColor'
                  viewBox='0 0 20 20'
               >
                  <path
                     fillRule='evenodd'
                     d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                     clipRule='evenodd'
                  />
               </svg>
            )}
         </div>

         {/* Feedback */}
         {showFeedback && validation.feedback.length > 0 && (
            <ul className='space-y-1 text-xs text-muted-foreground'>
               {validation.feedback.map((feedback, index) => (
                  <li key={index} className='flex items-start gap-2'>
                     <span className='text-(--warning) mt-0.5'>•</span>
                     <span>{feedback}</span>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};
