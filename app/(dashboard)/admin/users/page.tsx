"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
   Users,
   Search,
   MoreVertical,
   UserPlus,
   Shield,
   Mail,
   Calendar,
} from "lucide-react";

interface User {
   id: string;
   name: string;
   email: string;
   role: "admin" | "editor" | "viewer";
   status: "active" | "inactive" | "suspended";
   documentsCount: number;
   lastActive: Date;
   createdAt: Date;
}

const mockUsers: User[] = [
   {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      documentsCount: 45,
      lastActive: new Date(),
      createdAt: new Date("2024-01-15"),
   },
   {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "editor",
      status: "active",
      documentsCount: 32,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date("2024-02-20"),
   },
   {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "viewer",
      status: "inactive",
      documentsCount: 12,
      lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date("2024-03-10"),
   },
];

export default function AdminUsersPage() {
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

   const getRoleBadgeColor = (role: string) => {
      switch (role) {
         case "admin":
            return "bg-red-500/10 text-red-500 border-red-500/20";
         case "editor":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
         case "viewer":
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
         default:
            return "";
      }
   };

   const getStatusBadgeColor = (status: string) => {
      switch (status) {
         case "active":
            return "bg-green-500/10 text-green-500 border-green-500/20";
         case "inactive":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
         case "suspended":
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
                  <Users className='h-8 w-8' />
                  User Management
               </h1>
               <p className='text-muted-foreground mt-1'>
                  Manage users, roles, and permissions
               </p>
            </div>
            <Button>
               <UserPlus className='mr-2 h-4 w-4' />
               Add User
            </Button>
         </div>

         {/* Stats */}
         <div className='grid gap-4 md:grid-cols-4'>
            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Total Users
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>1,234</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  +12% from last month
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Shield className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Active Users
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>1,089</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  88% of total users
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     New This Month
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>89</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  +23% from last month
               </p>
            </div>

            <div className='rounded-lg border bg-card p-6'>
               <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-muted-foreground'>
                     Suspended
                  </p>
               </div>
               <p className='text-2xl font-bold mt-2'>12</p>
               <p className='text-xs text-muted-foreground mt-1'>
                  1% of total users
               </p>
            </div>
         </div>

         {/* Search and Filters */}
         <div className='flex items-center gap-4'>
            <div className='relative flex-1'>
               <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
               <Input placeholder='Search users...' className='pl-9' />
            </div>
            <Button variant='outline'>Filters</Button>
         </div>

         {/* Users Table */}
         <div className='rounded-lg border bg-card'>
            <div className='overflow-x-auto'>
               <table className='w-full'>
                  <thead>
                     <tr className='border-b bg-muted/50'>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           User
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Role
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Status
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Documents
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Last Active
                        </th>
                        <th className='px-6 py-3 text-left text-sm font-medium'>
                           Joined
                        </th>
                        <th className='px-6 py-3 text-right text-sm font-medium'>
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className='divide-y'>
                     {mockUsers.map((user) => (
                        <tr key={user.id} className='hover:bg-muted/50'>
                           <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                 <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                    <span className='text-sm font-semibold text-primary'>
                                       {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                    </span>
                                 </div>
                                 <div>
                                    <p className='font-medium'>{user.name}</p>
                                    <p className='text-sm text-muted-foreground'>
                                       {user.email}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getRoleBadgeColor(user.role)}
                              >
                                 {user.role}
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <Badge
                                 variant='outline'
                                 className={getStatusBadgeColor(user.status)}
                              >
                                 {user.status}
                              </Badge>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm'>
                                 {user.documentsCount}
                              </span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm text-muted-foreground'>
                                 {formatRelativeTime(user.lastActive)}
                              </span>
                           </td>
                           <td className='px-6 py-4'>
                              <span className='text-sm text-muted-foreground'>
                                 {user.createdAt.toLocaleDateString()}
                              </span>
                           </td>
                           <td className='px-6 py-4 text-right'>
                              <Button variant='ghost' size='sm'>
                                 <MoreVertical className='h-4 w-4' />
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
