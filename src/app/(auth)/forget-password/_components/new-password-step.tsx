"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye, MoveLeft, MoveRight} from "lucide-react";
import ErrorMessage from "../../_components/error-message";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type NewPasswordStepProps = { 
    email:string;
    otpToken:string;
}

export default function NewPasswordStep({email, otpToken}:NewPasswordStepProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const res = await fetch(`https://exam.elevateegy.com/api/v1/auth/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, token:otpToken, newPassword}),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      toast({
        description: "Password updated successfully",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      setError(data.message || "Failed to reset password. Please try again.");
    }
  }
  
  return (
    <div>
      <Card className="w-full border-none">
      <CardContent>
        <h2 className="font-inter font-bold text-black text-[1.8rem]">
            Create a New Password
          </h2>
          <p className="text-gray-500 font-medium mt-1 font-geistMono">
            Create a new strong password for your account.
          </p>
        <form id="create-password-form" className="mt-10" onSubmit={handleSubmit}>
          <FieldGroup>
             <Field>
                  <FieldLabel htmlFor="create-new-password" className="font-geistMono">
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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
            </Field>
             <Field>
                  <FieldLabel htmlFor="confirm-new-password" className="font-geistMono">
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
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
            </Field>
          </FieldGroup>
          {error && <ErrorMessage message={error} />}
          <button type="submit" className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10 flex items-center justify-center gap-2">Reset Password</button>
        </form>
        <p className="mt-9 text-center text-sm text-gray-500 font-geistMono">Don’t have an account? <Link href="/register"><span className="text-primary">Create yours</span></Link></p>
      </CardContent>
    </Card>
    </div>
  )
}
