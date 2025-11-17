<<<<<<< HEAD
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
=======
import React from "react";
import Header from "./_components/Header";

function provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />

      {children}
    </div>
  );
}

export default provider;
>>>>>>> 1914cb2711da1b87cc19e24ae72744266672de40
