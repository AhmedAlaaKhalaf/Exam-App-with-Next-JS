import RegisterForm from "./_components/register-form";

export default function Login() {
  return (
    <div className='w-full max-w-md px-6 flex flex-col gap-6 md:gap-10'>
      <h2 className="font-inter font-bold text-black text-2xl sm:text-[1.8rem]">
            Create Account
      </h2>
      <RegisterForm />
    </div>
  )
}
