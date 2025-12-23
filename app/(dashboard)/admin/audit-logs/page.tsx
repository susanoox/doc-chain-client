"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   FileText,
   Search,
   Download,
   Filter,
   User,
   Activity,
   Shield,
   Database,
   Edit,
   Trash,
   Share,
} from "lucide-react";

interface AuditLog {
   id: string;
   action: "create" | "update" | "delete" | "share" | "view" | "verify";
   resource: "document" | "user" | "settings" | "blockchain";
   resourceName: string;
   user: string;
   userEmail: string;
   ipAddress: string;
   timestamp: Date;
   details: string;
}

const mockAuditLogs: AuditLog[] = [
   {
      id: "1",
      action: "create",
      resource: "document",
      resourceName: "Contract Agreement.pdf",
      user: "John Doe",
      userEmail: "john@example.com",
      ipAddress: "192.168.1.100",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      details: "Created new document and uploaded to IPFS",
   },
   {
      id: "2",
      action: "verify",
      resource: "blockchain",
      resourceName: "Medical Record.pdf",
      user: "Jane Smith",
      userEmail: "jane@example.com",
      ipAddress: "192.168.1.101",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      details: "Verified document on blockchain",
   },
   {
      id: "3",
      action: "share",
      resource: "document",
      resourceName: "Financial Report.xlsx",
      user: "Bob Johnson",
      userEmail: "bob@example.com",
      ipAddress: "192.168.1.102",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      details: "Shared document with alice@example.com",
   },
   {
      id: "4",
      action: "delete",
      resource: "document",
      resourceName: "Old Contract.pdf",
      user: "Admin User",
      userEmail: "admin@example.com",
      ipAddress: "192.168.1.1",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      details: "Permanently deleted document from system",
   },
   {
      id: "5",
      action: "update",
      resource: "user",
      resourceName: "user-123",
      user: "Admin User",
      userEmail: "admin@example.com",
      ipAddress: "192.168.1.1",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      details: "Updated user role to editor",
   },
];

export default function AdminAuditLogsPage() {
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

   const getActionIcon = (action: string) => {
      switch (action) {
         case "create":
            return <FileText className='h-4 w-4' />;
         case "update":
            return <Edit className='h-4 w-4' />;
         case "delete":
            return <Trash className='h-4 w-4' />;
         case "share":
            return <Share className='h-4 w-4' />;
         case "view":
            return <Activity className='h-4 w-4' />;
         case "verify":
            return <Shield className='h-4 w-4' />;
         default:
            return <Activity className='h-4 w-4' />;
      }
   };

   const getActionColor = (action: string) => {
      switch (action) {
         case "create":
            return "bg-green-500/10 text-green-500 border-green-500/20";
         case "update":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
         case "delete":
            return "bg-red-500/10 text-red-500 border-red-500/20";
         case "share":
            return "bg-purple-500/10 text-purple-500 border-purple-500/20";
         case "view":
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
         case "verify":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
         default:
            return "";
      }
   };

   const getResourceIcon = (resource: string) => {
      switch (resource) {
         case "document":
            return <FileText className='h-4 w-4' />;
         case "user":
            return <User className='h-4 w-4' />;
         case "settings":
            return <Activity className='h-4 w-4' />;
         case "blockchain":
            return <Database className='h-4 w-4' />;
         default:
            return <Activity className='h-4 w-4' />;
      }
   };

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold flex items-center gap-2'>
                  <FileText className='h-8 w-8' />
                  Audit Logs
               </h1>
               <p className='text-muted-foreground mt-1'>
                  Complete activity trail and system audit logs
               </p>
            </div>
            <Button>
               <Download className='mr-2 h-4 w-4' />
               Export Logs
            </Button>
         </div>

         {/* Stats */}
         <div className='grid gap-4 md:grid-cols-4'>
            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Total Events (24h)
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>1,847</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  +18% from yesterday
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Active Users
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>234</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Currently online
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Document Actions
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>892</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Today's activity
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Shield className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Security Events
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>23</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Requires review
               </p>
            </div>
         </div>

         {/* Search and Filters */}
         <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
               <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
               <Input placeholder='Search audit logs...' className='pl-9' />
            </div>
            <Button variant='outline'>
               <Filter className='mr-2 h-4 w-4' />
               Filters
            </Button>
         </div>

         {/* Audit Logs Table */}
         <div className='rounded-lg border bg-card'>
            <div className='px-6 py-4 border-b'>
               <h2 className='text-lg font-semibold'>Activity Log</h2>
               <p className='text-sm text-muted-foreground mt-1'>
                  Detailed audit trail of all system activities
               </p>
            </div>

            <div className='overflow-x-auto'>
               <table className='w-full'>
                  <thead>
                     <tr className='border-b bg-muted/50'>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Action
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Resource
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           User
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           IP Address
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Details
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
                     {mockAuditLogs.map((log) => (
                        <tr key={log.id} className='hover:bg-muted/50'>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getActionColor(log.action)}
                              >
                                 <span className='flex items-center gap-1'>
                                    {getActionIcon(log.action)}
                                    {log.action}
                                 </span>
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                 {getResourceIcon(log.resource)}
                                 <div>
                                    <p className='font-medium'>
                                       {log.resourceName}
                                    </p>
                                    <p className='text-sm text-muted-foreground capitalize'>
                                       {log.resource}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <div>
                                 <p className='font-medium'>{log.user}</p>
                                 <p className='text-sm text-muted-foreground'>
                                    {log.userEmail}
                                 </p>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm font-mono'>
                                 {log.ipAddress}
                              </span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm text-muted-foreground'>
                                 {log.details}
                              </span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm text-muted-foreground'>
                                 {formatRelativeTime(log.timestamp)}
                              </span>
                           </td>
                           <td className='px-6 py-4 text-right'>
                              <Button variant='ghost' size='sm'>
                                 Details
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
