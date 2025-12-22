"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
   children: ReactNode;
   fallback?: ReactNode;
}

interface State {
   hasError: boolean;
   error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error: Error): State {
      return {
         hasError: true,
         error,
      };
   }

   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
   }

   handleReset = () => {
      this.setState({ hasError: false, error: undefined });
   };

   render() {
      if (this.state.hasError) {
         if (this.props.fallback) {
            return this.props.fallback;
         }

         return (
            <div className='flex min-h-100 flex-col items-center justify-center p-8'>
               <div className='text-center'>
                  <h2 className='text-2xl font-bold text-foreground mb-4'>
                     Something went wrong
                  </h2>
                  <p className='text-foreground mb-6'>
                     {this.state.error?.message ||
                        "An unexpected error occurred"}
                  </p>
                  <Button onClick={this.handleReset}>Try again</Button>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}
