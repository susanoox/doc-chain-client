"use client";

import { FC, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { validatePassword } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { cn } from "@/lib/utils";

export const ResetPasswordForm: FC = () => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { resetPassword, isLoading } = useAuth();
   const toast = useToast();

   const [token, setToken] = useState<string | null>(null);
   const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
   });
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [touched, setTouched] = useState<Record<string, boolean>>({});
   const [success, setSuccess] = useState(false);

   useEffect(() => {
      const tokenParam = searchParams.get("token");
      if (!tokenParam) {
         toast.error(
            "Invalid reset link",
            "The password reset link is missing or invalid."
         );
         router.push("/forgot-password");
         return;
      }
      setToken(tokenParam);
   }, [searchParams, toast, router]);

   const validateField = (name: string, value: any) => {
      switch (name) {
         case "password":
            if (!value) return "Password is required";
            const passwordValidation = validatePassword(value);
            if (!passwordValidation.isValid) {
               return passwordValidation.feedback[0] || "Password is too weak";
            }
            return "";
         case "confirmPassword":
            if (!value) return "Please confirm your password";
            if (value !== formData.password) return "Passwords do not match";
            return "";
         default:
            return "";
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
         const error = validateField(name, value);
         setErrors((prev) => ({ ...prev, [name]: error }));
      }

      // Re-validate confirm password if password changes
      if (name === "password" && touched.confirmPassword) {
         const confirmError =
            formData.confirmPassword !== value ? "Passwords do not match" : "";
         setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      }
   };

   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token) {
         toast.error("Invalid reset link");
         return;
      }

      // Mark all fields as touched
      setTouched({ password: true, confirmPassword: true });

      // Validate all fields
      const newErrors: Record<string, string> = {};
      Object.keys(formData).forEach((key) => {
         const error = validateField(
            key,
            formData[key as keyof typeof formData]
         );
         if (error) newErrors[key] = error;
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
         toast.error("Please fix the errors before submitting");
         return;
      }

      try {
         await resetPassword(token, formData.password);
         setSuccess(true);
         toast.success(
            "Password reset successful!",
            "Your password has been updated. You can now login with your new password."
         );

         // Redirect to login after 2 seconds
         setTimeout(() => {
            router.push("/login");
         }, 2000);
      } catch (error: any) {
         toast.error(
            "Password reset failed",
            error.message ||
               "The reset link may have expired. Please request a new one."
         );
      }
   };

   if (!token) {
      return (
         <div className='text-center space-y-4'>
            <div className='w-12 h-12 mx-auto rounded-full bg-(--error)/10 flex items-center justify-center'>
               <svg
                  className='w-6 h-6 text-(--error)'
                  fill='currentColor'
                  viewBox='0 0 20 20'
               >
                  <path
                     fillRule='evenodd'
                     d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                     clipRule='evenodd'
                  />
               </svg>
            </div>
            <p className='text-sm text-muted-foreground'>Loading...</p>
         </div>
      );
   }

   if (success) {
      return (
         <div className='space-y-6'>
            <div className='p-4 rounded-lg bg-(--success)/10 border border-(--success)/20'>
               <div className='flex items-start gap-3'>
                  <svg
                     className='w-5 h-5 text-(--success) mt-0.5 shrink-0'
                     fill='currentColor'
                     viewBox='0 0 20 20'
                  >
                     <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                     />
                  </svg>
                  <div className='space-y-1'>
                     <p className='font-medium text-sm'>
                        Password reset successful!
                     </p>
                     <p className='text-sm text-muted-foreground'>
                        Your password has been updated. Redirecting to login...
                     </p>
                  </div>
               </div>
            </div>

            <Button
               type='button'
               className='w-full'
               onClick={() => router.push("/login")}
            >
               Go to login
            </Button>
         </div>
      );
   }

   return (
      <form onSubmit={handleSubmit} className='space-y-6'>
         <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
               Enter your new password below. Make sure it's strong and secure.
            </p>
         </div>

         {/* Password Field */}
         <div className='space-y-2'>
            <Label htmlFor='password'>New password</Label>
            <Input
               id='password'
               name='password'
               type='password'
               autoComplete='new-password'
               placeholder='••••••••'
               value={formData.password}
               onChange={handleChange}
               onBlur={handleBlur}
               className={cn(
                  errors.password &&
                     touched.password &&
                     "border-(--error) focus-visible:ring-(--error)"
               )}
            />
            {errors.password && touched.password && (
               <p className='text-xs text-(--error)'>{errors.password}</p>
            )}

            {/* AI-powered Password Strength Meter */}
            {formData.password && (
               <div className='pt-2'>
                  <PasswordStrengthMeter password={formData.password} />
               </div>
            )}
         </div>

         {/* Confirm Password Field */}
         <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm new password</Label>
            <Input
               id='confirmPassword'
               name='confirmPassword'
               type='password'
               autoComplete='new-password'
               placeholder='••••••••'
               value={formData.confirmPassword}
               onChange={handleChange}
               onBlur={handleBlur}
               className={cn(
                  errors.confirmPassword &&
                     touched.confirmPassword &&
                     "border-(--error) focus-visible:ring-(--error)"
               )}
            />
            {errors.confirmPassword && touched.confirmPassword && (
               <p className='text-xs text-(--error)'>
                  {errors.confirmPassword}
               </p>
            )}
         </div>

         {/* Submit Button */}
         <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? (
               <>
                  <svg
                     className='animate-spin -ml-1 mr-2 h-4 w-4'
                     fill='none'
                     viewBox='0 0 24 24'
                  >
                     <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                     />
                     <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                     />
                  </svg>
                  Resetting password...
               </>
            ) : (
               "Reset password"
            )}
         </Button>

         {/* Back to Login */}
         <div className='text-center'>
            <Link
               href='/login'
               className='text-sm text-primary hover:text-primary/80 transition-colors'
            >
               ← Back to login
            </Link>
         </div>

         {/* Security Notice */}
         <div className='p-3 rounded-lg bg-blockchain/5 border border-blockchain/10'>
            <div className='flex items-start gap-2'>
               <svg
                  className='w-4 h-4 text-blockchain mt-0.5 shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
               >
                  <path
                     fillRule='evenodd'
                     d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                     clipRule='evenodd'
                  />
               </svg>
               <p className='text-xs text-muted-foreground'>
                  Your new password will be immediately secured with blockchain
                  technology.
               </p>
            </div>
         </div>
      </form>
   );
};
