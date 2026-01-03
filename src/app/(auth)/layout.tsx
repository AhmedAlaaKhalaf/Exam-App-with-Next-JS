import React from "react";
import Sidebar from './_components/sidebar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center items-stretch min-h-screen">
      <aside className="w-full lg:w-1/2">
        <Sidebar/>
      </aside>
      <main className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-0">{children}</main>
    </div>
  );
}
