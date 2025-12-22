import { UserRole } from '@/lib/types';

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRoles: UserRole[] | 'all'): boolean {
  if (requiredRoles === 'all') return true;
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}

/**
 * Check if user can edit
 */
export function canEdit(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'editor';
}

/**
 * Check if user can view only
 */
export function isViewer(userRole: UserRole): boolean {
  return userRole === 'viewer';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
  };
  return roleNames[role];
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: 'bg-[var(--destructive)] text-[var(--destructive-foreground)]',
    editor: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
    viewer: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
  };
  return colors[role];
}
