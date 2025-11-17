// app/layout.tsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="h-full m-0 p-0 flex flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
