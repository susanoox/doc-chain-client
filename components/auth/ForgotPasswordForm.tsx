"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { isValidEmail } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const ForgotPasswordForm: FC = () => {
   const router = useRouter();
   const { forgotPassword, isLoading } = useAuth();
   const toast = useToast();

   const [email, setEmail] = useState("");
   const [error, setError] = useState("");
   const [touched, setTouched] = useState(false);
   const [submitted, setSubmitted] = useState(false);

   const validateEmail = (value: string) => {
      if (!value) return "Email is required";
      if (!isValidEmail(value)) return "Invalid email address";
      return "";
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);

      if (touched) {
         setError(validateEmail(value));
      }
   };

   const handleBlur = () => {
      setTouched(true);
      setError(validateEmail(email));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateEmail(email);
      setError(validationError);
      setTouched(true);

      if (validationError) {
         toast.error("Please enter a valid email address");
         return;
      }

      try {
         await forgotPassword(email);
         setSubmitted(true);
         toast.success(
            "Check your email",
            "If an account exists with this email, you will receive password reset instructions."
         );
      } catch (error: any) {
         // For security, we don't reveal if the email exists
         setSubmitted(true);
         toast.success(
            "Check your email",
            "If an account exists with this email, you will receive password reset instructions."
         );
      }
   };

   if (submitted) {
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
                     <p className='font-medium text-sm'>Email sent!</p>
                     <p className='text-sm text-muted-foreground'>
                        If an account exists with <strong>{email}</strong>, you
                        will receive an email with instructions to reset your
                        password.
                     </p>
                  </div>
               </div>
            </div>

            <div className='space-y-3'>
               <p className='text-sm text-muted-foreground'>
                  Didn't receive the email? Check your spam folder or try again.
               </p>
               <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={() => setSubmitted(false)}
               >
                  Send another email
               </Button>
            </div>

            <div className='text-center'>
               <Link
                  href='/login'
                  className='text-sm text-primary hover:text-primary/80 transition-colors'
               >
                  ← Back to login
               </Link>
            </div>
         </div>
      );
   }

   return (
      <form onSubmit={handleSubmit} className='space-y-6'>
         <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
               Enter your email address and we'll send you instructions to reset
               your password.
            </p>
         </div>

         {/* Email Field */}
         <div className='space-y-2'>
            <Label htmlFor='email'>Email address</Label>
            <Input
               id='email'
               name='email'
               type='email'
               autoComplete='email'
               placeholder='you@example.com'
               value={email}
               onChange={handleChange}
               onBlur={handleBlur}
               className={cn(
                  error &&
                     touched &&
                     "border-(--error) focus-visible:ring-(--error)"
               )}
            />
            {error && touched && (
               <p className='text-xs text-(--error)'>{error}</p>
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
                  Sending...
               </>
            ) : (
               "Send reset instructions"
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
                  For security reasons, we won't confirm whether this email is
                  registered. If it is, you'll receive a reset link shortly.
               </p>
            </div>
         </div>
      </form>
   );
};
