"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AISuggestion } from "@/lib/types/ai";
import { BrainCircuit, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestionsProps {
   suggestions?: AISuggestion[];
   maxItems?: number;
}

// Mock suggestions - will be replaced with real data
const mockSuggestions: AISuggestion[] = [
   {
      id: "1",
      type: "organization",
      title: "Organize similar documents",
      description:
         'Found 5 documents that could be grouped into a "Q4 Reports" folder',
      confidence: 0.92,
      data: { documentIds: ["1", "2", "3"], folderName: "Q4 Reports" },
   },
   {
      id: "2",
      type: "security",
      title: "Enable blockchain protection",
      description: "3 important documents are not yet protected by blockchain",
      confidence: 0.88,
      data: { documentIds: ["4", "5", "6"] },
   },
   {
      id: "3",
      type: "share",
      title: "Share with team members",
      description: 'Consider sharing "Project Plan.pdf" with your team',
      confidence: 0.75,
      data: { documentId: "7", users: ["user2", "user3"] },
   },
];

export const AISuggestions: FC<AISuggestionsProps> = ({
   suggestions = mockSuggestions,
   maxItems = 3,
}) => {
   const displaySuggestions = suggestions.slice(0, maxItems);

   const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.9) return "text-[var(--success)]";
      if (confidence >= 0.7) return "text-[var(--info)]";
      return "text-[var(--warning)]";
   };

   const getSuggestionIcon = (type: string) => {
      return <Sparkles size={16} />;
   };

   return (
      <Card className='p-6 border-ai/20 bg-ai/5'>
         <div className='flex items-center gap-2 mb-4'>
            <BrainCircuit className='text-ai' size={20} />
            <h2 className='text-xl font-semibold'>AI Suggestions</h2>
            <Badge variant='secondary' className='ml-auto'>
               {displaySuggestions.length} pending
            </Badge>
         </div>

         <div className='space-y-3'>
            {displaySuggestions.length === 0 ? (
               <p className='text-sm text-muted-foreground text-center py-8'>
                  No AI suggestions at the moment
               </p>
            ) : (
               displaySuggestions.map((suggestion) => (
                  <div
                     key={suggestion.id}
                     className='p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                  >
                     <div className='flex items-start gap-3'>
                        <div className='w-8 h-8 rounded-full bg-ai/10 text-ai flex items-center justify-center flex-shrink-0 mt-0.5'>
                           {getSuggestionIcon(suggestion.type)}
                        </div>
                        <div className='flex-1 min-w-0'>
                           <div className='flex items-start justify-between gap-2'>
                              <p className='text-sm font-medium'>
                                 {suggestion.title}
                              </p>
                              <span
                                 className={cn(
                                    "text-xs font-medium",
                                    getConfidenceColor(suggestion.confidence)
                                 )}
                              >
                                 {Math.round(suggestion.confidence * 100)}%
                              </span>
                           </div>
                           <p className='text-xs text-muted-foreground mt-1'>
                              {suggestion.description}
                           </p>
                           <div className='flex gap-2 mt-3'>
                              <Button
                                 size='sm'
                                 variant='default'
                                 className='h-7 text-xs'
                              >
                                 Apply
                              </Button>
                              <Button
                                 size='sm'
                                 variant='ghost'
                                 className='h-7 text-xs'
                              >
                                 Dismiss
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {displaySuggestions.length > 0 && (
            <Button variant='ghost' className='w-full mt-4' size='sm'>
               View all suggestions
               <ChevronRight size={16} className='ml-1' />
            </Button>
         )}
      </Card>
   );
};
