"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { isValidEmail, validatePassword } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BlockchainBadge } from "./BlockchainBadge";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { cn } from "@/lib/utils";

export const RegisterForm: FC = () => {
   const router = useRouter();
   const { register, isLoading } = useAuth();
   const toast = useToast();

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
   });

   const [errors, setErrors] = useState<Record<string, string>>({});
   const [touched, setTouched] = useState<Record<string, boolean>>({});

   // Real-time validation
   const validateField = (name: string, value: any) => {
      switch (name) {
         case "name":
            if (!value) return "Name is required";
            if (value.length < 2) return "Name must be at least 2 characters";
            return "";
         case "email":
            if (!value) return "Email is required";
            if (!isValidEmail(value)) return "Invalid email address";
            return "";
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
         case "agreeToTerms":
            if (!value) return "You must agree to the terms and conditions";
            return "";
         default:
            return "";
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Validate on change if field was touched
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

   const handleCheckboxChange = (checked: boolean) => {
      setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
      if (touched.agreeToTerms) {
         const error = validateField("agreeToTerms", checked);
         setErrors((prev) => ({ ...prev, agreeToTerms: error }));
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(formData).reduce((acc, key) => {
         acc[key] = true;
         return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);

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
         await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            agreeToTerms: formData.agreeToTerms,
         });

         toast.success(
            "Account created!",
            "Welcome to DocChain. Your account is now protected by blockchain technology."
         );
         router.push("/dashboard");
      } catch (error: any) {
         toast.error(
            "Registration failed",
            error.message || "Something went wrong"
         );
      }
   };

   return (
      <form onSubmit={handleSubmit} className='space-y-5'>
         {/* Blockchain Badge */}
         <div className='flex justify-center'>
            <BlockchainBadge size='sm' />
         </div>

         {/* Name Field */}
         <div className='space-y-2'>
            <Label htmlFor='name'>Full name</Label>
            <Input
               id='name'
               name='name'
               type='text'
               autoComplete='name'
               placeholder='John Doe'
               value={formData.name}
               onChange={handleChange}
               onBlur={handleBlur}
               className={cn(
                  errors.name &&
                     touched.name &&
                     "border-(--error) focus-visible:ring-(--error)"
               )}
            />
            {errors.name && touched.name && (
               <p className='text-xs text-(--error)'>{errors.name}</p>
            )}
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
               value={formData.email}
               onChange={handleChange}
               onBlur={handleBlur}
               className={cn(
                  errors.email &&
                     touched.email &&
                     "border-(--error) focus-visible:ring-(--error)"
               )}
            />
            {errors.email && touched.email && (
               <p className='text-xs text-(--error)'>{errors.email}</p>
            )}
         </div>

         {/* Password Field */}
         <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
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
            <Label htmlFor='confirmPassword'>Confirm password</Label>
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

         {/* Terms and Conditions */}
         <div className='space-y-2'>
            <div className='flex items-start space-x-2'>
               <Checkbox
                  id='agreeToTerms'
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  className={cn(
                     errors.agreeToTerms &&
                        touched.agreeToTerms &&
                        "border-(--error)"
                  )}
               />
               <label
                  htmlFor='agreeToTerms'
                  className='text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
               >
                  I agree to the{" "}
                  <Link
                     href='/terms'
                     className='text-primary hover:text-primary/80 underline'
                  >
                     Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                     href='/privacy'
                     className='text-primary hover:text-primary/80 underline'
                  >
                     Privacy Policy
                  </Link>
               </label>
            </div>
            {errors.agreeToTerms && touched.agreeToTerms && (
               <p className='text-xs text-(--error) ml-6'>
                  {errors.agreeToTerms}
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
                  Creating account...
               </>
            ) : (
               "Create account"
            )}
         </Button>

         {/* Login Link */}
         <p className='text-center text-sm text-muted-foreground'>
            Already have an account?{" "}
            <Link
               href='/login'
               className='text-primary hover:text-primary/80 font-medium transition-colors'
            >
               Sign in
            </Link>
         </p>

         {/* AI Security Notice */}
         <div className='p-3 rounded-lg bg-ai/5 border border-ai/10'>
            <div className='flex items-start gap-2'>
               <svg
                  className='w-4 h-4 text-ai mt-0.5 shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
               >
                  <path
                     fillRule='evenodd'
                     d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                     clipRule='evenodd'
                  />
               </svg>
               <p className='text-xs text-muted-foreground'>
                  Your account will be secured with blockchain technology and
                  enhanced with AI-powered features for document management.
               </p>
            </div>
         </div>
      </form>
   );
};
