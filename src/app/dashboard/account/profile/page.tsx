"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiBase, jsonAuthHeaders, isApiFailure, apiErrorMessage } from "@/lib/api";

export default function Profile() {
    const { data: session, update } = useSession();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setFirstName(session.user.firstName || "");
            setLastName(session.user.lastName || "");
            setUsername(session.user.username || "");
            setEmail(session.user.email || "");
            setPhone(session.user.phone || "");
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        if (!session?.accessToken) {
            toast({
                description: "You must be logged in to update your profile",
                variant: "destructive",
            });
            setSaving(false);
            return;
        }

        const response = await fetch(`${getApiBase()}/users/profile`, {
            method: "PATCH",
            headers: {
                ...jsonAuthHeaders(session.accessToken),
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phone,
            }),
        });
        const data = await response.json().catch(() => ({}));
        console.log(data);
        if (response.ok && !isApiFailure(data)) {
            toast({
                description: "Profile updated successfully",
            });
            // Refresh session to get updated user data
            await update();
        } else {
            toast({
                description: apiErrorMessage(data, "Failed to update profile"),
                variant: "destructive",
            });
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        
        if (!session?.accessToken) {
            toast({
                description: "You must be logged in to delete your account",
                variant: "destructive",
            });
            setDeleting(false);
            setShowDeleteDialog(false);
            return;
        }

        const res = await fetch(`${getApiBase()}/users/account`, {
            method: "DELETE",
            headers: {
                ...jsonAuthHeaders(session.accessToken),
            },
        });
        const data = await res.json().catch(() => ({}));
        console.log(data);
        if (res.ok && !isApiFailure(data)) {
            toast({
                description: "Account deleted successfully",
                variant: "success",
            });
            setShowDeleteDialog(false);
            // Sign out and redirect to login
            await signOut({ redirect: false });
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } else {
            toast({
                description: apiErrorMessage(data, "Failed to delete account"),
                variant: "destructive",
            });
            setDeleting(false);
        }
    };

    return (
        <div>
        <Card className="w-full border-none">
        <CardContent>
          <form id="profile-form" onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <div className="flex gap-4">
                   <Field>
                    <FieldLabel htmlFor="first-name" className="font-geistMono">
                      First Name
                    </FieldLabel>
                    <Input
                      id="first-name"
                      placeholder="Ahmed"
                      type="text"
                      className="input-default text-secondary"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
              </Field>
             <Field>
                    <FieldLabel htmlFor="last-name" className="font-geistMono">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="last-name"
                      placeholder="Abdullah"
                      type="text"
                      className="input-default text-secondary"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
              </Field> 
              </div>
                   <Field>
                    <FieldLabel htmlFor="username" className="font-geistMono">
                      Username
                    </FieldLabel>
                    <Input
                      id="username"
                      placeholder="user123"
                      type="text"
                      className="input-default text-secondary bg-gray-50"
                      value={username}
                      readOnly
                      aria-readonly
                      />
              </Field>
             <Field>
                    <FieldLabel htmlFor="email" className="font-geistMono">
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      placeholder="user@example.com"
                      type="email"
                      className="input-default text-secondary bg-gray-50"
                      value={email}
                      readOnly
                      aria-readonly
                    />
              </Field>
             <Field>
                    <FieldLabel htmlFor="phone" className="font-geistMono">
                      Phone Number
                    </FieldLabel>
                    <PhoneInput 
                      placeholder="+201011707320" 
                      defaultCountry="EG"
                      countries={['EG']}
                      id="phone"
                      value={phone}
                      onChange={setPhone}
                    />
              </Field>
            </FieldGroup>
            <div className="flex gap-4">
            <button 
                type="button" 
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-50 font-geistMono text-sm text-red-600 w-full h-11 mt-10 hover:bg-red-100 transition-colors"
                disabled={saving || deleting}
            >
                Delete My Account
            </button>
            <button type="submit" className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10" disabled={saving || deleting}>
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[558px]">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-10 h-10 stroke-1 bg-red-100 p-3 rounded-[50%] text-red-600 border-[14px] box-content border-red-50" />
            </div>
            <DialogTitle className="text-center text-red-600 font-geistMono">
              Are you sure you want to delete your account?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 font-geistMono mt-2">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-center mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteDialog(false)}
              className="font-geistMono w-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-geistMono w-full"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                'Yes, delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    )
}