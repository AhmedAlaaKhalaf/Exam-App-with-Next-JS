"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import ErrorMessage from "@/app/(auth)/_components/error-message";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!session?.accessToken) {
      setError("You must be logged in to change your password");
      return;
    }

    const res = await fetch(
      `https://exam.elevateegy.com/api/v1/auth/changePassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: session.accessToken,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          password: newPassword,
          rePassword: confirmPassword,
        }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      toast({
        description: "Password updated successfully",
        variant: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      const userEmail = session?.user?.email;
      if (userEmail) {
        const result = await signIn("credentials", {
          email: userEmail,
          password: newPassword,
          redirect: false,
        });

        if (result?.ok) {
          setTimeout(() => {
            window.location.href = "/dashboard/account/profile";
          }, 500);
        } else {
          toast({
            title: "Error",
            description:
              "Password changed but session update failed. Please log in again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        }
      } else {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } else {
      toast({
        title: "Error",
        description:
          data.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
      setError(data.message || "Failed to change password. Please try again.");
    }
  };

  return (
    <div>
      <Card className="w-full border-none">
        <CardContent>
          <form
            id="create-password-form"
            className="mt-10"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="create-new-password"
                  className="font-geistMono"
                >
                  Current Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="current-password"
                    placeholder="********"
                    className="input-default pr-10"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="create-new-password"
                  className="font-geistMono"
                >
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="create-new-password"
                    placeholder="********"
                    className="input-default pr-10"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="confirm-new-password"
                  className="font-geistMono"
                >
                  Confirm New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    placeholder="********"
                    className="input-default pr-10"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>
            </FieldGroup>
            {error && <ErrorMessage message={error} />}
            <button
              type="submit"
              className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10 flex items-center justify-center gap-2"
            >
              Update Password
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
