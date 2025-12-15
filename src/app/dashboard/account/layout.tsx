import { ChevronLeft, UserRound } from "lucide-react";
import Link from "next/link";
import AccountSidebar from "./_components/account-sidebar";
export default function AccountLayout({children}: {children: React.ReactNode}) {
    return <>
        <div className="p-6 flex flex-col gap-6 bg-gray-50">
        <div className="flex justify-center items-stretch gap-4">
        <Link
          href="/dashboard/diplomas"
          className="cursor-pointer bg-white border border-primary flex justify-center items-center px-2 py-4 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="text-primary w-6 h-6" />
        </Link>
        <header className="flex items-center gap-4 bg-primary p-4 w-full">
          <div className="icon">
            <UserRound className="text-white w-10 h-10" />
          </div>
          <div className="font-inter">
            <p className="font-semibold text-white text-[2rem] capitalize">
              Account Settings
            </p>
          </div>
        </header>
      </div>
        <div className="flex justify-center items-stretch h-screen gap-6">
              <aside className="w-1/4 h-screen bg-white p-6">
              <AccountSidebar/>
              </aside>
              <main className="w-3/4 overflow-y-auto flex flex-col bg-white p-6">
              {children}
              </main>
        </div>
        </div>
        </>
}