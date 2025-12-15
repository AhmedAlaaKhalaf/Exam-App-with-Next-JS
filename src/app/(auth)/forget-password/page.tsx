"use client";
import { useState } from "react";
import EmailStep from "./_components/email-step";
import NewPasswordStep from "./_components/new-password-step";
import OtpStep from "./_components/otp-step";

export default function ForgetPassword() {
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email");
  const [email, setEmail] = useState<string>("");
  const [otpToken, setOtpToken] = useState("");
  return (
    <div className="px-32 flex flex-col">
      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onNext={() => setStep("otp")}
        />
      )}
      {step === "otp" && (
        <OtpStep 
        email={email}
        onNext={(token) => {setOtpToken(token); setStep("new-password")}}
        onBack={() => setStep("email")}
        />
        )}
      {step === "new-password" && <NewPasswordStep email={email} otpToken={otpToken}/>}
    </div>
  );
}
