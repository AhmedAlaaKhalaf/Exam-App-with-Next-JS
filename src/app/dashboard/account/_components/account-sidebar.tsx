"use client";
import { CircleUserRound, Lock, LogOut } from "lucide-react"
import MenuItem from "../../_components/menu-item";
import { useState } from "react";
import { signOut } from "next-auth/react";


export default function AccountSidebar() {
    const [loggingOut, setLoggingOut] = useState(false);
    
    const handleLogout = async () => {
        setLoggingOut(true);
        await signOut({ redirect: false });
        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
    };
    return (
        <div className="profileMenuWrap flex flex-col gap-14 grow min-h-[70vh] justify-between">
        <ul className="flex flex-col gap-3 adminMenu" id="profileMenu">
          <MenuItem href="/dashboard/account/profile" defaultActive>
              <div className="icon w-6 h-6"><CircleUserRound className="text-primary"/></div>
              <div className="menuName font-geistMono">
                <p className="text-primary font-normal">Profile</p>
              </div>
          </MenuItem>
          <MenuItem href="/dashboard/account/change-password">
              <div className="icon w-6 h-6"><Lock className="text-muted"/></div>
              <div className="menuName font-geistMono">
                <p className="text-muted font-normal">Change Password</p>
              </div>
          </MenuItem>
        </ul>
        <button type="button" onClick={handleLogout} className="bg-red-50 font-geistMono text-sm text-red-600 w-full h-11 mt-10" disabled={loggingOut}>
              {loggingOut ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Logging out...
                </span>
              ) : (
                <div className="flex items-center px-4 gap-2">
                <LogOut className="w-4 h-4 rotate-180" />
                Logout
                </div>
              )}
            </button>
      </div>
    )
}