"use client";

import { FC, useState, FormEvent } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Check, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrength {
   score: number; // 0-4
   label: string;
   color: string;
}

/**
 * ChangePassword Component
 * Handles password change with strength validation
 * Follows Single Responsibility Principle - only handles password management
 */
export const ChangePassword: FC = () => {
   const { changePassword, isUpdating } = useUserStore();
   const [formData, setFormData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
   });
   const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false,
      confirm: false,
   });
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState("");

   // Calculate password strength
   const getPasswordStrength = (password: string): PasswordStrength => {
      if (!password) return { score: 0, label: "", color: "" };

      let score = 0;

      // Length
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;

      // Complexity
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z\d]/.test(password)) score++;

      const strength: PasswordStrength = {
         score: Math.min(score, 4),
         label: ["", "Weak", "Fair", "Good", "Strong"][Math.min(score, 4)],
         color: [
            "",
            "text-red-500",
            "text-orange-500",
            "text-yellow-500",
            "text-green-500",
         ][Math.min(score, 4)],
      };

      return strength;
   };

   const strength = getPasswordStrength(formData.newPassword);
   const passwordsMatch =
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword !== "";

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess(false);

      if (formData.newPassword !== formData.confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      if (strength.score < 2) {
         setError("Password is too weak. Please use a stronger password.");
         return;
      }

      try {
         await changePassword(formData.currentPassword, formData.newPassword);
         setSuccess(true);
         setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
         });
         setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
         setError(
            err instanceof Error ? err.message : "Failed to change password"
         );
      }
   };

   const canSubmit =
      formData.currentPassword &&
      formData.newPassword &&
      formData.confirmPassword &&
      passwordsMatch &&
      strength.score >= 2;

   return (
      <form onSubmit={handleSubmit} className='space-y-6'>
         {/* Success message */}
         {success && (
            <div className='flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600'>
               <Check size={20} />
               <span className='text-sm font-medium'>
                  Password changed successfully
               </span>
            </div>
         )}

         {/* Error message */}
         {error && (
            <div className='flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive'>
               <X size={20} />
               <span className='text-sm font-medium'>{error}</span>
            </div>
         )}

         {/* Current password */}
         <div className='space-y-2'>
            <Label htmlFor='current-password'>Current Password</Label>
            <div className='relative'>
               <Input
                  id='current-password'
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                     })
                  }
                  placeholder='Enter your current password'
                  required
               />
               <button
                  type='button'
                  onClick={() =>
                     setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                     })
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
               >
                  {showPasswords.current ? (
                     <EyeOff size={20} />
                  ) : (
                     <Eye size={20} />
                  )}
               </button>
            </div>
         </div>

         {/* New password */}
         <div className='space-y-2'>
            <Label htmlFor='new-password'>New Password</Label>
            <div className='relative'>
               <Input
                  id='new-password'
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                     setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder='Enter your new password'
                  required
               />
               <button
                  type='button'
                  onClick={() =>
                     setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                     })
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
               >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
            </div>

            {/* Password strength indicator */}
            {formData.newPassword && (
               <div className='space-y-2'>
                  <div className='flex gap-1'>
                     {[1, 2, 3, 4].map((level) => (
                        <div
                           key={level}
                           className={cn(
                              "h-1.5 flex-1 rounded-full transition-colors",
                              strength.score >= level
                                 ? strength.score === 1
                                    ? "bg-red-500"
                                    : strength.score === 2
                                    ? "bg-orange-500"
                                    : strength.score === 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                 : "bg-muted"
                           )}
                        />
                     ))}
                  </div>
                  <p className={cn("text-xs font-medium", strength.color)}>
                     {strength.label} password
                  </p>
               </div>
            )}

            {/* Requirements */}
            <div className='space-y-1 text-xs text-muted-foreground'>
               <p className='font-medium'>Password must contain:</p>
               <ul className='space-y-1 ml-4'>
                  <li
                     className={
                        formData.newPassword.length >= 8 ? "text-green-600" : ""
                     }
                  >
                     • At least 8 characters
                  </li>
                  <li
                     className={
                        /[a-z]/.test(formData.newPassword) &&
                        /[A-Z]/.test(formData.newPassword)
                           ? "text-green-600"
                           : ""
                     }
                  >
                     • Uppercase and lowercase letters
                  </li>
                  <li
                     className={
                        /\d/.test(formData.newPassword) ? "text-green-600" : ""
                     }
                  >
                     • At least one number
                  </li>
                  <li
                     className={
                        /[^a-zA-Z\d]/.test(formData.newPassword)
                           ? "text-green-600"
                           : ""
                     }
                  >
                     • At least one special character
                  </li>
               </ul>
            </div>
         </div>

         {/* Confirm password */}
         <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Confirm New Password</Label>
            <div className='relative'>
               <Input
                  id='confirm-password'
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                     })
                  }
                  placeholder='Confirm your new password'
                  required
               />
               <button
                  type='button'
                  onClick={() =>
                     setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                     })
                  }
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
               >
                  {showPasswords.confirm ? (
                     <EyeOff size={20} />
                  ) : (
                     <Eye size={20} />
                  )}
               </button>
            </div>

            {/* Match indicator */}
            {formData.confirmPassword && (
               <p
                  className={cn(
                     "text-xs font-medium",
                     passwordsMatch ? "text-green-600" : "text-destructive"
                  )}
               >
                  {passwordsMatch
                     ? "Passwords match"
                     : "Passwords do not match"}
               </p>
            )}
         </div>

         {/* Submit */}
         <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={!canSubmit || isUpdating}>
               {isUpdating ? (
                  <>
                     <Loader2 size={16} className='mr-2 animate-spin' />
                     Changing Password...
                  </>
               ) : (
                  <>
                     <Lock size={16} className='mr-2' />
                     Change Password
                  </>
               )}
            </Button>
         </div>
      </form>
   );
};
