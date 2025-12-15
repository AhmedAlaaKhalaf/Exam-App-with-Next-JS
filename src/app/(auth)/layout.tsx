import React from "react";
import Sidebar from './_components/sidebar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center">
      <aside className="w-1/2">
      <Sidebar/>
      </aside>
      <main className="w-1/2">{children}</main>
    </div>
  );
}
