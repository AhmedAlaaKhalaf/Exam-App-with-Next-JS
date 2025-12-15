"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye } from "lucide-react";
import ErrorMessage from "../../_components/error-message";
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from "react";
import { signIn } from 'next-auth/react';

interface LoginFormFields {
  email: string,
  password:string
}

export default function LoginForm() {
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   
  const {register, handleSubmit, formState: { errors }} = useForm<LoginFormFields>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<LoginFormFields> = async (values) => {
    setError('');
    setLoading(true);
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (response?.ok) {
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/dashboard/diplomas';
        location.href = callbackUrl; // to make full Url reload of the page
        return;
      }
      setError(response?.error || 'Login Failed');
      console.log(response);
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
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
           <Field>
                  <FieldLabel htmlFor="login-form-email" className="font-geistMono">
                    Email
                  </FieldLabel>
                  <Input
                    id="login-form-email"
                    placeholder="user@example.com"
                    type="email"
                    className="input-default"
                    {...register('email', {
                      required: {
                        value: true,
                        message: "Email is required"
                      },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </Field>
           <Field>
                  <FieldLabel htmlFor="login-form-password" className="font-geistMono">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="login-form-password"
                      placeholder="********"
                      className="input-default pr-10"
                      type={showPassword ? "text" : "password"}
                      {...register('password', {
                      required: {
                        value: true,
                        message: "Password is required"
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
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </Field>
          </FieldGroup>
          <Link href="/forget-password"><p className="text-right font-geistMono text-sm text-blue-600 mt-3">Forgot your password?</p></Link>
          {error && !Object.keys(errors).length && <ErrorMessage message={error} />}
          <button type="submit" className="bg-primary font-geistMono text-sm text-white w-full h-11 mt-10" disabled={loading}>
             {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-9 text-center text-sm text-gray-500 font-geistMono">Don’t have an account? <Link href="/register"><span className="text-primary">Create yours</span></Link></p>
      </CardContent>
    </Card>
    </div>
  )
}
