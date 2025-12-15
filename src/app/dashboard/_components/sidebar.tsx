import { GraduationCap, UserRound } from "lucide-react"
import { getServerSession } from 'next-auth/next';
import { authOption } from '@/auth';
import MenuItem from "./menu-item";


export default async function Sidebar() {
  const session = await getServerSession(authOption);
  
  const firstName = session?.user?.firstName || 'User';
  const email = session?.user?.email || 'user@example.com';
  return (
    <div className="h-full">
      <div className="p-10 flex flex-col">
        <div className="logo mb-3">
          <img src="/assets/images/logo.png" width={190} alt="logo" /> 
        </div>
        <div className="flex items-center gap-3">
          <img src="/assets/icons/folder-code.svg" alt="exam-icon" /> 
          <p className="font-geistMono text-primary text-[1.25rem] font-semibold">Exam App</p>
        </div>
        <div className="adminMenuWrap flex flex-col gap-14 mt-16 grow min-h-[70vh] justify-between">
          <ul className="flex flex-col gap-3 adminMenu" id="adminMenu">
           <MenuItem href="/dashboard/diplomas" defaultActive>
                <div className="icon w-6 h-6"><GraduationCap className="text-primary"/></div>
                <div className="menuName font-geistMono">
                  <p className="active-menu-text font-normal">Diplomas</p>
                </div>
           </MenuItem>
            <MenuItem href="/dashboard/account/profile">
                <div className="icon w-6 h-6"><UserRound className="text-muted"/></div>
                <div className="menuName font-geistMono">
                  <p className="text-muted font-normal">Account Settings</p>
                </div>
            </MenuItem>
          </ul>
          <div className="flex items-center gap-3">
          <img src="/assets/images/avatar.png" alt="avatar" /> 
          <div className="accountInfo">
            <p className="name font-geistMono text-primary text-[1rem] font-semibold">{firstName}</p>
            <p className="email font-geistMono text-paragraph text-[0.75rem] font-normal">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
