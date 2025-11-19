"use client";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ClerkProvider>
  );
}
