// app/provider.tsx
"use client";

import Header from "./_components/Header";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
