"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Link as LinkIcon,
   CheckCircle,
   XCircle,
   Clock,
   TrendingUp,
   Database,
   Zap,
} from "lucide-react";

interface BlockchainTransaction {
   id: string;
   hash: string;
   documentId: string;
   documentName: string;
   type: "verification" | "update" | "transfer";
   status: "confirmed" | "pending" | "failed";
   blockNumber: number;
   timestamp: Date;
   gasUsed: string;
}

const mockTransactions: BlockchainTransaction[] = [
   {
      id: "1",
      hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      documentId: "doc-1",
      documentName: "Contract Agreement.pdf",
      type: "verification",
      status: "confirmed",
      blockNumber: 12345678,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      gasUsed: "0.00234 ETH",
   },
   {
      id: "2",
      hash: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a",
      documentId: "doc-2",
      documentName: "Medical Record.pdf",
      type: "update",
      status: "pending",
      blockNumber: 12345679,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      gasUsed: "0.00189 ETH",
   },
   {
      id: "3",
      hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      documentId: "doc-3",
      documentName: "Financial Report.xlsx",
      type: "transfer",
      status: "confirmed",
      blockNumber: 12345677,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      gasUsed: "0.00156 ETH",
   },
];

export default function AdminBlockchainPage() {
   const { user, isLoading } = useAuth();

   useEffect(() => {
      if (!isLoading && (!user || user.role !== "admin")) {
         redirect("/dashboard");
      }
   }, [user, isLoading]);

   if (isLoading) {
      return (
         <div className='flex items-center justify-center min-h-screen'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
         </div>
      );
   }

   if (!user || user.role !== "admin") {
      return null;
   }

   const formatRelativeTime = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "confirmed":
            return "bg-green-500/10 text-green-500 border-green-500/20";
         case "pending":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
         case "failed":
            return "bg-red-500/10 text-red-500 border-red-500/20";
         default:
            return "";
      }
   };

   const getTypeColor = (type: string) => {
      switch (type) {
         case "verification":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
         case "update":
            return "bg-purple-500/10 text-purple-500 border-purple-500/20";
         case "transfer":
            return "bg-orange-500/10 text-orange-500 border-orange-500/20";
         default:
            return "";
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "confirmed":
            return <CheckCircle className='h-4 w-4' />;
         case "pending":
            return <Clock className='h-4 w-4' />;
         case "failed":
            return <XCircle className='h-4 w-4' />;
         default:
            return null;
      }
   };

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold flex items-center gap-2'>
                  <LinkIcon className='h-8 w-8' />
                  Blockchain Monitor
               </h1>
               <p className='text-muted-foreground mt-1'>
                  Track document verification and blockchain transactions
               </p>
            </div>
            <Button>
               <Database className='mr-2 h-4 w-4' />
               View Explorer
            </Button>
         </div>

         {/* Blockchain Stats */}
         <div className='grid gap-4 md:grid-cols-4'>
            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Confirmed Transactions
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>2,456</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  +15% from last week
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-yellow-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Pending
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>34</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Awaiting confirmation
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Zap className='h-4 w-4 text-blue-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Avg. Gas Fee
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>0.0019</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  ETH per transaction
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4 text-purple-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Success Rate
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>99.2%</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Last 30 days
               </p>
            </div>
         </div>

         {/* Recent Transactions */}
         <div className='rounded-lg border bg-card'>
            <div className='px-6 py-4 border-b'>
               <h2 className='text-lg font-semibold'>Recent Transactions</h2>
               <p className='text-sm text-muted-foreground mt-1'>
                  Latest blockchain verification activities
               </p>
            </div>

            <div className='overflow-x-auto'>
               <table className='w-full'>
                  <thead>
                     <tr className='border-b bg-muted/50'>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Transaction Hash
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Document
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Type
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Status
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Block
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Gas Used
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Time
                        </th>
                        <th className='px-6 py-3 text-right text-sm font-medium'>
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className='divide-y'>
                     {mockTransactions.map((tx) => (
                        <tr key={tx.id} className='hover:bg-muted/50'>
                           <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                 <LinkIcon className='h-4 w-4 text-muted-foreground' />
                                 <span className='font-mono text-sm'>
                                    {tx.hash.substring(0, 20)}...
                                 </span>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <div>
                                 <p className='font-medium'>
                                    {tx.documentName}
                                 </p>
                                 <p className='text-sm text-muted-foreground'>
                                    {tx.documentId}
                                 </p>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getTypeColor(tx.type)}
                              >
                                 {tx.type}
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getStatusColor(tx.status)}
                              >
                                 <span className='flex items-center gap-1'>
                                    {getStatusIcon(tx.status)}
                                    {tx.status}
                                 </span>
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm font-mono'>
                                 {tx.blockNumber.toLocaleString()}
                              </span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm'>{tx.gasUsed}</span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm text-muted-foreground'>
                                 {formatRelativeTime(tx.timestamp)}
                              </span>
                           </td>
                           <td className='px-6 py-4 text-right'>
                              <Button variant='ghost' size='sm'>
                                 View
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
