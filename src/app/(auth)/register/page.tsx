import RegisterForm from "./_components/register-form";

export default function Login() {
  return (
    <div className='px-32 flex flex-col gap-10'>
      <h2 className="font-inter font-bold text-black text-[1.8rem]">
            Create Account
      </h2>
      <RegisterForm />
    </div>
  )
}
