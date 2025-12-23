"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
   User,
   Shield,
   Settings as SettingsIcon,
   ChevronRight,
} from "lucide-react";

interface SettingsSidebarProps {
   className?: string;
}

interface NavItem {
   id: string;
   label: string;
   href: string;
   icon: ReactNode;
   description: string;
}

const navItems: NavItem[] = [
   {
      id: "profile",
      label: "Profile",
      href: "/settings/profile",
      icon: <User size={20} />,
      description: "Manage your personal information",
   },
   {
      id: "security",
      label: "Security",
      href: "/settings/security",
      icon: <Shield size={20} />,
      description: "Password and security settings",
   },
   {
      id: "preferences",
      label: "Preferences",
      href: "/settings/preferences",
      icon: <SettingsIcon size={20} />,
      description: "Customize your experience",
   },
];

/**
 * SettingsSidebar Component
 * Navigation sidebar for settings pages
 * Follows Single Responsibility Principle - only handles settings navigation
 */
export const SettingsSidebar: FC<SettingsSidebarProps> = ({ className }) => {
   const pathname = usePathname();

   return (
      <aside className={cn("w-full lg:w-64 space-y-1", className)}>
         <div className='mb-6'>
            <h2 className='text-2xl font-bold'>Settings</h2>
            <p className='text-sm text-muted-foreground'>
               Manage your account settings and preferences
            </p>
         </div>

         <nav className='space-y-1'>
            {navItems.map((item) => {
               const isActive = pathname === item.href;

               return (
                  <Link
                     key={item.id}
                     href={item.href}
                     className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                        "hover:bg-accent",
                        isActive && "bg-accent text-accent-foreground"
                     )}
                  >
                     <div
                        className={cn(
                           "shrink-0 text-muted-foreground",
                           isActive && "text-foreground"
                        )}
                     >
                        {item.icon}
                     </div>

                     <div className='flex-1 min-w-0'>
                        <div className='font-medium'>{item.label}</div>
                        <div className='text-xs text-muted-foreground truncate'>
                           {item.description}
                        </div>
                     </div>

                     <ChevronRight
                        size={16}
                        className={cn(
                           "shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                           isActive && "opacity-100"
                        )}
                     />
                  </Link>
               );
            })}
         </nav>
      </aside>
   );
};
