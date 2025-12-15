import React from 'react'
import LoginForm from './_components/login-form';

export default function Login() {
  return (
    <div className='px-32 flex flex-col gap-10'>
      <h2 className="font-inter font-bold text-black text-[1.8rem]">
            Login
      </h2>
      <LoginForm />
    </div>
  )
}
