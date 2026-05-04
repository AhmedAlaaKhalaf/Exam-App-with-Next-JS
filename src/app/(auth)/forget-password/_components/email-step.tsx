"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getApiBase, isApiFailure, apiErrorMessage } from "@/lib/api";

type EmailStepProps = {
  email:string;
  setEmail: (email:string) => void;
  onSent: () => void;
}

export default function EmailStep({email, setEmail, onSent}: EmailStepProps) {
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || email.trim() === "") {
      setError("Please enter your email address");
      return;
    }

    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/forget-password`
        : undefined;
    
    const res = await fetch(`${getApiBase()}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, ...(redirectUrl ? { redirectUrl } : {}) }),
    });
    
    const data = await res.json();
    
    if (res.ok && !isApiFailure(data)) {
      onSent();
    } else {
      setError(apiErrorMessage(data, "Failed to send reset link. Please try again."));
    }
  };
  return (
    <div>
      <Card className="w-full border-none">
        <CardContent>
          <h2 className="font-inter font-bold text-black text-[1.8rem]">
            Forgot Password
          </h2>
          <p className="text-gray-500 font-medium mt-1 font-geistMono">
            Don’t worry, we will help you recover your account.
          </p>
          <form id="email-step-form" className="mt-10" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="forget-form-email"
                  className="font-geistMono"
                >
                  Email
                </FieldLabel>
                <Input
                  id="forget-form-email"
                  placeholder="user@example.com"
                  type="email"
                  className="input-default"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            </FieldGroup>
            {error ? (
              <p className="text-red-600 text-sm mt-3 font-geistMono">{error}</p>
            ) : null}
            <button
              type="submit"
              className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10 flex items-center justify-center gap-2"
            >
              Continue
              <MoveRight className="w-4" />
            </button>
          </form>
          <p className="mt-9 text-center text-sm text-gray-500 font-geistMono">
            Don’t have an account?
            <Link href="/register">
              <span className="text-primary"> Create yours</span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
