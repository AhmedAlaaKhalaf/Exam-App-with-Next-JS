import { ChevronLeft, UserRound } from "lucide-react";
import Link from "next/link";
import AccountSidebar from "./_components/account-sidebar";
export default function AccountLayout({children}: {children: React.ReactNode}) {
    return <>
        <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-gray-50 grow">
        <div className="flex justify-center items-stretch gap-2 md:gap-4">
        <Link
          href="/dashboard/diplomas"
          className="cursor-pointer bg-white border border-primary flex justify-center items-center px-2 py-3 md:py-4 hover:bg-gray-50 transition-colors shrink-0"
        >
          <ChevronLeft className="text-primary w-5 h-5 md:w-6 md:h-6" />
        </Link>
        <header className="flex items-center gap-2 md:gap-4 bg-primary p-3 md:p-4 w-full">
          <div className="icon">
            <UserRound className="text-white w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div className="font-inter">
            <p className="font-semibold text-white text-xl md:text-2xl capitalize">
              Account Settings
            </p>
          </div>
        </header>
      </div>
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4 md:gap-6 grow">
              <aside className="w-full lg:w-1/4 bg-white p-4 md:p-6 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
              <AccountSidebar/>
              </aside>
              <main className="w-full lg:w-3/4 overflow-y-auto flex flex-col bg-white p-4 md:p-6">
              {children}
              </main>
        </div>
        </div>
        </>
}