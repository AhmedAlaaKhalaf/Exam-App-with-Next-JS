"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

type OtpStepProps = {
  email: string;
  onNext: (token:string) => void;
  onBack: () => void;
};

export default function OtpStep({ email, onNext, onBack }: OtpStepProps) {
  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setCountdown(60);
    const res = await fetch(`https://exam.elevateegy.com/api/v1/auth/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      // OTP sent successfully
      toast({
        description: "OTP sent successfully",
      });
    } else {
      toast({
        description: "Failed to send OTP. Please try again.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || otp.length !== 6) return;
    
    const body = { email, resetCode: otp };
    console.log('Sending:', body);
    
    const res = await fetch(`https://exam.elevateegy.com/api/v1/auth/verifyResetCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('Response:', data);
    if (res.ok) {
      onNext(data.token);
    }
  };

  return (
    <div>
      <Card className="w-full border-none">
        <CardContent>
          <div>
            <MoveLeft className="w-8 h-8 p-2 border cursor-pointer" onClick={onBack}/>
          </div>
          <form id="otp-step-form" className="mt-10" onSubmit={handleSubmit}>
            <FieldGroup>
              <h2 className="font-inter font-bold text-black text-[1.8rem]">
                Verify OTP
              </h2>
              <p className="text-gray-500 font-medium mt-1 font-geistMono">
                Please enter the 6-digits code we have sent to:{" "}
                <span className="font-bold text-black">{email}</span>
                <span className="text-primary underline ps-1 cursor-pointer" onClick={onBack}>Edit</span>
              </p>
              <Field>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-4">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Field>
              {countdown > 0 ? (
                <p className="text-gray-500 text-center font-medium mt-1 font-geistMono">
                  You can request another code in: {countdown}s
                </p>
              ) : (
                <p className="text-center font-medium mt-1 font-geistMono">
                  <span 
                    className="text-primary underline cursor-pointer hover:text-primary/80"
                    onClick={handleResend}
                  >
                    Resend
                  </span>
                </p>
              )}
            </FieldGroup>
            <button
              type="submit"
              className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10 flex items-center justify-center gap-2"
            >
              Verify Code
            </button>
          </form>
          <p className="mt-9 text-center text-sm text-gray-500 font-geistMono">
            Don’t have an account?
            <Link href="/register">
              <span className="text-primary cursor-pointer ps-1">Create yours</span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
