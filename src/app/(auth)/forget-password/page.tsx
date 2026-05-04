"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EmailStep from "./_components/email-step";
import NewPasswordStep from "./_components/new-password-step";

function SentMessage() {
  return (
    <div className="w-full max-w-md px-6 font-geistMono text-center space-y-4 py-8">
      <h2 className="font-inter font-bold text-black text-[1.5rem]">Check your email</h2>
      <p className="text-gray-600 text-sm">
        If an account exists for that address, we sent a link to reset your password. Open the link,
        then return here if you were redirected with a reset token in the URL.
      </p>
      <Link href="/login" className="text-primary underline inline-block">
        Back to login
      </Link>
    </div>
  );
}

function ForgetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const [step, setStep] = useState<"email" | "sent" | "new-password">("email");
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setStep("new-password");
    }
  }, [tokenFromUrl]);

  return (
    <div className="w-full max-w-md px-6 flex flex-col">
      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onSent={() => setStep("sent")}
        />
      )}
      {step === "sent" && <SentMessage />}
      {step === "new-password" && (
        <NewPasswordStep
          resetToken={resetToken}
          onBack={() => {
            if (tokenFromUrl) {
              window.location.href = "/forget-password";
              return;
            }
            setStep("email");
            setResetToken("");
          }}
        />
      )}
    </div>
  );
}

export default function ForgetPassword() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md px-6 flex justify-center py-12 font-geistMono text-gray-600">
          Loading…
        </div>
      }
    >
      <ForgetPasswordContent />
    </Suspense>
  );
}
