"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye } from "lucide-react";
import ErrorMessage from "../../_components/error-message";
import { PhoneInput } from "@/components/ui/phone-input";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { getApiBase, isApiFailure, apiErrorMessage } from "@/lib/api";

interface RegisterFormFields {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

function formatRegisterError(data: unknown): string {
  if (typeof data === "object" && data !== null && "errors" in data) {
    const errs = (data as { errors: { path?: string; message?: string; messages?: string[] }[] })
      .errors;
    if (Array.isArray(errs) && errs.length) {
      return errs
        .map((e) => (Array.isArray(e.messages) ? e.messages.join(", ") : null) || e.message || e.path)
        .filter(Boolean)
        .join("; ");
    }
  }
  return apiErrorMessage(data, "Registration failed");
}

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const { register, getValues, control, handleSubmit, formState: { errors } } = useForm<RegisterFormFields>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      rePassword: '',
      phone: ''
    },
    mode: 'onBlur',
  });

  const sendVerificationCode = async () => {
    setError("");
    const email = getValues("email");
    if (!email?.includes("@")) {
      setError("Enter a valid email before requesting a code.");
      return;
    }
    setCodeLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/auth/send-email-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || isApiFailure(data)) {
        setError(formatRegisterError(data));
        return;
      }
      setEmailVerified(false);
    } catch {
      setError("Failed to send verification code.");
    } finally {
      setCodeLoading(false);
    }
  };

  const confirmVerificationCode = async () => {
    setError("");
    const email = getValues("email");
    const code = verificationCode.trim();
    if (!email || code.length < 4) {
      setError("Enter the code from your email.");
      return;
    }
    setVerifyLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/auth/confirm-email-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok || isApiFailure(data)) {
        setError(formatRegisterError(data));
        return;
      }
      setEmailVerified(true);
    } catch {
      setError("Could not verify email code.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const onSubmit: SubmitHandler<RegisterFormFields> = async (values) => {
    setError('');
    if (!emailVerified) {
      setError("Please verify your email: send the code, enter it, and tap Verify email before registering.");
      return;
    }
    setLoading(true);

    try {
      let phone = values.phone || '';
      if (phone.startsWith('+20')) {
        phone = '0' + phone.substring(3);
      }

      const response = await fetch(`${getApiBase()}/auth/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.rePassword,
          firstName: values.firstName,
          lastName: values.lastName,
          ...(phone ? { phone } : {}),
        })
      });
      const data = await response.json();

      if (!response.ok || isApiFailure(data)) {
        setError(formatRegisterError(data));
        return;
      }

      location.href = "/login";
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card className="w-full border-none">
        <CardContent>
          <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <div className="rounded-md border border-amber-200/90 bg-amber-50 px-3 py-2.5 text-sm font-geistMono text-amber-950 leading-snug">
                <span className="font-semibold">Verify your email first.</span>{" "}
                You must confirm your email with a code before you can create your account. Enter your email below, send the code, then paste it and tap Verify email.
              </div>

              <div className="flex gap-4">
                <Field>
                  <FieldLabel htmlFor="first-name" className="font-geistMono">
                    First Name
                  </FieldLabel>
                  <Input
                    id="first-name"
                    placeholder="Ahmed"
                    type="text"
                    className="input-default"
                    {...register('firstName', {
                      required: {
                        value: true,
                        message: "First Name is required"
                      },
                      minLength: {
                        value: 2,
                        message: "First Name should be at least 2 characters"
                      },
                    })}
                  />
                  {errors.firstName?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.firstName?.message}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name" className="font-geistMono">
                    Last Name
                  </FieldLabel>
                  <Input
                    id="last-name"
                    placeholder="Abdullah"
                    type="text"
                    className="input-default"
                    {...register('lastName', {
                      required: {
                        value: true,
                        message: "Last Name is required"
                      },
                      minLength: {
                        value: 2,
                        message: "Last Name should be at least 2 characters"
                      }
                    })}
                  />
                  {errors.lastName?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.lastName?.message}</p>}
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
                  className="input-default"
                  {...register('username', {
                    required: {
                      value: true,
                      message: "Username is required"
                    },
                    minLength: {
                      value: 4,
                      message: "Username should be at least 4 characters"
                    }
                  })}
                />
                {errors.username?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.username?.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="register-form-email" className="font-geistMono">
                  Email
                </FieldLabel>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <Input
                      id="register-form-email"
                      placeholder="user@example.com"
                      type="email"
                      autoComplete="email"
                      className="input-default h-11"
                      {...register('email', {
                        required: {
                          value: true,
                          message: "Email is required"
                        },
                        validate: (value: string) => value.includes("@") || "Please enter a valid email"
                      })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    disabled={codeLoading}
                    className="h-11 shrink-0 whitespace-nowrap rounded-md border border-primary bg-white px-4 text-sm font-geistMono font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto w-full"
                  >
                    {codeLoading ? "Sending…" : "Send code"}
                  </button>
                </div>
                {errors.email?.message && <p className="text-red-600 font-geistMono text-sm mt-1">{errors.email?.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="email-verify-code" className="font-geistMono">
                  Verification code
                </FieldLabel>
                <p className="text-xs text-gray-500 font-geistMono -mt-0.5 mb-1.5">
                  Check your inbox after sending the code.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <Input
                      id="email-verify-code"
                      placeholder="Paste code from email"
                      className="input-default h-11"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={confirmVerificationCode}
                    disabled={verifyLoading}
                    className="h-11 shrink-0 whitespace-nowrap rounded-md bg-primary px-4 text-sm font-geistMono font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto w-full"
                  >
                    {verifyLoading ? "Verifying…" : "Verify email"}
                  </button>
                </div>
                {emailVerified ? (
                  <p className="text-emerald-700 text-sm font-geistMono mt-2">Email verified — you can finish the form and create your account.</p>
                ) : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="register-form-phone" className="font-geistMono">
                  Phone Number
                </FieldLabel>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Phone number is required"
                    },
                    validate: (value) => {
                      if (!value) return "Phone number is required";
                      if (value && !value.startsWith('+20') && !value.startsWith('0')) {
                        return "Only Egyptian phone numbers are allowed (must start with +20 or 0)";
                      }
                      return true;
                    }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      placeholder="+201011707320"
                      defaultCountry="EG"
                      countries={['EG']}
                      id="register-form-phone"
                      value={value}
                      onChange={onChange}
                      international
                    />
                  )}
                />
                {errors.phone?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.phone?.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="register-form-password" className="font-geistMono">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="register-form-password"
                    placeholder="********"
                    className="input-default pr-10"
                    type={showPassword ? "text" : "password"}
                    {...register('password', {
                      required: {
                        value: true,
                        message: "Password is required"
                      },
                      minLength: {
                        value: 6,
                        message: "Password should be at least 6 characters"
                      },
                      validate: (v: string) => {
                        if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
                        if (!/[^A-Za-z0-9]/.test(v)) return "Include at least one special character";
                        return true;
                      }
                    })}
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
                {errors.password?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.password?.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password" className="font-geistMono">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    placeholder="********"
                    className="input-default pr-10"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('rePassword', {
                      required: {
                        value: true,
                        message: "Please confirm your password"
                      },
                      validate: (v, formValues) =>
                        v === formValues.password || "Passwords do not match"
                    })}
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
                {errors.rePassword?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.rePassword?.message}</p>}
              </Field>
            </FieldGroup>
            {error && !Object.keys(errors).length && <ErrorMessage message={error} />}
            {Object.keys(errors).length > 0 && <ErrorMessage />}
            <button type="submit" className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <p className="mt-9 text-center text-sm text-gray-500 font-geistMono">Already have an account? <Link href="/login"><span className="text-primary cursor-pointer">Login</span></Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
