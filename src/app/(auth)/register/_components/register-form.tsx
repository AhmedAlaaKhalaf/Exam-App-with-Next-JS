"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye } from "lucide-react";
import ErrorMessage from "../../_components/error-message";
import { PhoneInput } from "@/components/ui/phone-input";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface RegisterFormFields {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}
interface RegisterFormResponse {
  message:string;
  token:string;
  user: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
}

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {register, getValues, control,handleSubmit, formState:{errors}} = useForm<RegisterFormFields>({
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
  }   
  )

 

  const onSubmit: SubmitHandler<RegisterFormFields>  = async (values) => {
    setError('');
    setLoading(true);
    
    try {
      console.log(values)
      
      // Convert +20 to 0 (Egypt country code to local format)
      let phone = values.phone || '';
      if (phone.startsWith('+20')) {
        phone = '0' + phone.substring(3); 
      }
      
      const payload = {
        ...values,
        phone: phone
      };
      
      const response = await fetch(`https://exam.elevateegy.com/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const data: RegisterFormResponse = await response.json();
      console.log(data);
      
      if ("code" in data) {
        setError(data.message);
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
  console.log("errors",errors);
  
  return (
    <div>
      <Card className="w-full border-none">
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
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
                      }})} 
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
                      }})} 
                    />
                  {errors.username?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.username?.message}</p>}
            </Field>
           <Field>
                  <FieldLabel htmlFor="register-form-email" className="font-geistMono">
                    Email
                  </FieldLabel>
                  <Input
                    id="register-form-email"
                    placeholder="user@example.com"
                    type="email"
                    className="input-default"
                    {...register('email', {
                      required: {
                        value: true,
                        message: "Email is required"
                      },
                      validate: (value:string) => value.includes("@") || "Pease enter a valid email"
                    })} 
                  />
                  {errors.email?.message && <p className="text-red-600 font-geistMono text-sm mt-0">{errors.email?.message}</p>}
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
                        // Only allow Egypt (+20) country code
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
                        }})} 
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
