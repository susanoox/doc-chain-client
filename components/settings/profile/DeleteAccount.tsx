"use client";

import { FC, useState } from "react";
import { useUserStore } from "@/lib/stores/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * DeleteAccount Component
 * Handles account deletion with confirmation
 * Follows Single Responsibility Principle - only handles account deletion
 */
export const DeleteAccount: FC = () => {
   const { profile, deleteAccount, isLoading } = useUserStore();
   const [confirmEmail, setConfirmEmail] = useState("");
   const [isDeleting, setIsDeleting] = useState(false);

   const handleDelete = async () => {
      if (confirmEmail !== profile?.email) {
         alert("Email does not match");
         return;
      }

      setIsDeleting(true);
      try {
         await deleteAccount();
         // Redirect to login
         window.location.href = "/login";
      } catch (error) {
         console.error("Failed to delete account:", error);
         setIsDeleting(false);
      }
   };

   const canDelete = confirmEmail === profile?.email;

   return (
      <div className='space-y-4 border border-destructive/50 rounded-lg p-6 bg-destructive/5'>
         <div className='flex items-start gap-3'>
            <AlertTriangle
               className='text-destructive shrink-0 mt-1'
               size={24}
            />
            <div className='flex-1'>
               <h3 className='text-lg font-semibold text-destructive mb-2'>
                  Danger Zone
               </h3>
               <p className='text-sm text-muted-foreground mb-4'>
                  Once you delete your account, there is no going back. All your
                  documents, settings, and data will be permanently deleted.
               </p>

               <AlertDialog>
                  <AlertDialogTrigger>
                     <Button variant='destructive' size='sm'>
                        <Trash2 size={16} className='mr-2' />
                        Delete Account
                     </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>
                           Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className='space-y-4'>
                           <p>
                              This action cannot be undone. This will
                              permanently delete your account and remove all
                              your data from our servers.
                           </p>

                           <div className='space-y-2'>
                              <Label htmlFor='confirm-email'>
                                 Type <strong>{profile?.email}</strong> to
                                 confirm
                              </Label>
                              <Input
                                 id='confirm-email'
                                 type='email'
                                 value={confirmEmail}
                                 onChange={(e) =>
                                    setConfirmEmail(e.target.value)
                                 }
                                 placeholder='Enter your email'
                              />
                           </div>
                        </AlertDialogDescription>
                     </AlertDialogHeader>

                     <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                           Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                           onClick={handleDelete}
                           disabled={!canDelete || isDeleting}
                           className='bg-destructive hover:bg-destructive/90'
                        >
                           {isDeleting ? (
                              <>
                                 <Loader2
                                    size={16}
                                    className='mr-2 animate-spin'
                                 />
                                 Deleting...
                              </>
                           ) : (
                              "Delete Account"
                           )}
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>
         </div>
      </div>
   );
};
