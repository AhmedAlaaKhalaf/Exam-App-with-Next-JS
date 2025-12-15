"use client";
import ReactQueryProvider from "./components/react-query-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    </SessionProvider>
  );
}
