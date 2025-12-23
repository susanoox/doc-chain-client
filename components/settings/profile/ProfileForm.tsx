"use client";

import { FC, useState, FormEvent } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Check } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

/**
 * ProfileForm Component
 * Form for editing user profile information
 * Follows Single Responsibility Principle - only handles profile editing
 */
export const ProfileForm: FC = () => {
   const { profile, updateProfile, isUpdating } = useUserStore();
   const [formData, setFormData] = useState({
      name: profile?.name || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
   });
   const [saved, setSaved] = useState(false);

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      try {
         await updateProfile(formData);
         setSaved(true);
         setTimeout(() => setSaved(false), 3000);
      } catch (error) {
         console.error("Failed to update profile:", error);
      }
   };

   const hasChanges =
      formData.name !== profile?.name ||
      formData.email !== profile?.email ||
      formData.bio !== (profile?.bio || "");

   return (
      <form onSubmit={handleSubmit} className='space-y-8'>
         {/* Avatar */}
         <div>
            <h3 className='text-lg font-semibold mb-4'>Profile Photo</h3>
            <AvatarUpload
               currentAvatar={profile?.avatar}
               userName={profile?.name || "User"}
            />
         </div>

         <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold mb-4'>Personal Information</h3>

            <div className='space-y-4'>
               {/* Name */}
               <div className='space-y-2'>
                  <Label htmlFor='name'>Full Name</Label>
                  <Input
                     id='name'
                     type='text'
                     value={formData.name}
                     onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                     }
                     placeholder='Enter your full name'
                     required
                  />
               </div>

               {/* Email */}
               <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                     id='email'
                     type='email'
                     value={formData.email}
                     onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                     }
                     placeholder='your.email@example.com'
                     required
                  />
                  <p className='text-xs text-muted-foreground'>
                     Your email address is used for login and notifications
                  </p>
               </div>

               {/* Bio */}
               <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <Textarea
                     id='bio'
                     value={formData.bio}
                     onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                     }
                     placeholder='Tell us about yourself...'
                     rows={4}
                     maxLength={500}
                  />
                  <div className='flex justify-between text-xs text-muted-foreground'>
                     <span>Optional short description about yourself</span>
                     <span>{formData.bio.length}/500</span>
                  </div>
               </div>

               {/* Account info (read-only) */}
               <div className='grid grid-cols-2 gap-4 pt-4'>
                  <div className='space-y-2'>
                     <Label>Role</Label>
                     <div className='px-3 py-2 bg-muted rounded-md text-sm capitalize'>
                        {profile?.role || "N/A"}
                     </div>
                  </div>
                  <div className='space-y-2'>
                     <Label>Member Since</Label>
                     <div className='px-3 py-2 bg-muted rounded-md text-sm'>
                        {profile?.createdAt
                           ? new Date(profile.createdAt).toLocaleDateString()
                           : "N/A"}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Submit */}
         <div className='flex items-center justify-end gap-3 pt-4 border-t'>
            {saved && (
               <div className='flex items-center gap-2 text-sm text-green-600'>
                  <Check size={16} />
                  Saved successfully
               </div>
            )}

            <Button type='submit' disabled={!hasChanges || isUpdating}>
               {isUpdating ? (
                  <>
                     <Loader2 size={16} className='mr-2 animate-spin' />
                     Saving...
                  </>
               ) : (
                  <>
                     <Save size={16} className='mr-2' />
                     Save Changes
                  </>
               )}
            </Button>
         </div>
      </form>
   );
};
