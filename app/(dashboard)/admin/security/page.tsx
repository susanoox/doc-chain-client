"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Shield,
   Lock,
   AlertTriangle,
   CheckCircle,
   XCircle,
   Activity,
   Download,
} from "lucide-react";

interface SecurityEvent {
   id: string;
   type: "login" | "failed_login" | "password_change" | "suspicious_activity";
   user: string;
   email: string;
   ipAddress: string;
   location: string;
   timestamp: Date;
   severity: "low" | "medium" | "high" | "critical";
   status: "resolved" | "investigating" | "open";
}

const mockSecurityEvents: SecurityEvent[] = [
   {
      id: "1",
      type: "failed_login",
      user: "John Doe",
      email: "john@example.com",
      ipAddress: "192.168.1.100",
      location: "New York, USA",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      severity: "medium",
      status: "investigating",
   },
   {
      id: "2",
      type: "suspicious_activity",
      user: "Jane Smith",
      email: "jane@example.com",
      ipAddress: "203.0.113.45",
      location: "Unknown",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: "high",
      status: "open",
   },
   {
      id: "3",
      type: "password_change",
      user: "Bob Johnson",
      email: "bob@example.com",
      ipAddress: "192.168.1.105",
      location: "Los Angeles, USA",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: "low",
      status: "resolved",
   },
];

export default function AdminSecurityPage() {
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

   const getEventIcon = (type: string) => {
      switch (type) {
         case "login":
            return <CheckCircle className='h-4 w-4' />;
         case "failed_login":
            return <XCircle className='h-4 w-4' />;
         case "password_change":
            return <Lock className='h-4 w-4' />;
         case "suspicious_activity":
            return <AlertTriangle className='h-4 w-4' />;
         default:
            return <Activity className='h-4 w-4' />;
      }
   };

   const getSeverityColor = (severity: string) => {
      switch (severity) {
         case "low":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
         case "medium":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
         case "high":
            return "bg-orange-500/10 text-orange-500 border-orange-500/20";
         case "critical":
            return "bg-red-500/10 text-red-500 border-red-500/20";
         default:
            return "";
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "resolved":
            return "bg-green-500/10 text-green-500 border-green-500/20";
         case "investigating":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
         case "open":
            return "bg-red-500/10 text-red-500 border-red-500/20";
         default:
            return "";
      }
   };

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold flex items-center gap-2'>
                  <Shield className='h-8 w-8' />
                  Security Center
               </h1>
               <p className='text-muted-foreground mt-1'>
                  Monitor security events and system protection
               </p>
            </div>
            <Button>
               <Download className='mr-2 h-4 w-4' />
               Export Report
            </Button>
         </div>

         {/* Security Stats */}
         <div className='grid gap-4 md:grid-cols-4'>
            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <AlertTriangle className='h-4 w-4 text-yellow-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Active Threats
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>3</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Requires attention
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <XCircle className='h-4 w-4 text-red-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Failed Logins (24h)
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>47</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  -12% from yesterday
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Lock className='h-4 w-4 text-blue-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     2FA Enabled
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>87%</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  +5% this month
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Resolved Today
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>12</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  Security events
               </p>
            </div>
         </div>

         {/* Security Events */}
         <div className='rounded-lg border bg-card'>
            <div className='px-6 py-4 border-b'>
               <h2 className='text-lg font-semibold'>Recent Security Events</h2>
               <p className='text-sm text-muted-foreground mt-1'>
                  Real-time security monitoring and alerts
               </p>
            </div>

            <div className='overflow-x-auto'>
               <table className='w-full'>
                  <thead>
                     <tr className='border-b bg-muted/50'>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Event
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           User
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Location
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           IP Address
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Severity
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Status
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
                     {mockSecurityEvents.map((event) => (
                        <tr key={event.id} className='hover:bg-muted/50'>
                           <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                 <div className='p-2 rounded-full bg-muted'>
                                    {getEventIcon(event.type)}
                                 </div>
                                 <span className='font-medium capitalize'>
                                    {event.type.replace("_", " ")}
                                 </span>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <div>
                                 <p className='font-medium'>{event.user}</p>
                                 <p className='text-sm text-muted-foreground'>
                                    {event.email}
                                 </p>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm'>{event.location}</span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm font-mono'>
                                 {event.ipAddress}
                              </span>
                           </td>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getSeverityColor(event.severity)}
                              >
                                 {event.severity}
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getStatusColor(event.status)}
                              >
                                 {event.status}
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm text-muted-foreground'>
                                 {formatRelativeTime(event.timestamp)}
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
