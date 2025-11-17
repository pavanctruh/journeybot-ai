<<<<<<< HEAD
// app/_components/Header.tsx
"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact-us" },
];

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();

  // Prevent flash of wrong UI
  if (!isLoaded) return null;

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white dark:bg-neutral-900">
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <h2 className="font-bold text-2xl">JourneyBot.AI</h2>
      </div>

      {/* Navigation */}
      <div className="hidden md:flex gap-8 items-center">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className="text-lg hover:text-orange-600 transition-all">
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Auth Section */}
      <div className="flex gap-2 items-center">
        {!isSignedIn ? (
          // NOT SIGNED IN → Only "Get Started"
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : (
          // SIGNED IN → "Create New Trip" + Avatar
          <>
            <Link href="/create-new-trip">
              <Button>Create New Trip</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </div>
  );
}
=======
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuOptions = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "pricing",
    path: "/pricing",
  },
  {
    name: "Contact",
    path: "/contact-us",
  },
];

function Header() {
  return (
    <div className="flex justify-between items-center p-4">
      {/* Logo */}

      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={30} height={30}></Image>
        <h2 className="font-bold text-2xl">Ai Trip Planner</h2>
      </div>
      {/*Menu Options */}
      <div className="flex gap-8 items-center">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className="text-lg hover:scale-105 hover:text-orange-600 transition-all">
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      {/*Get Started button */}
      <Button>get Started</Button>
    </div>
  );
}
export default Header;
>>>>>>> 1914cb2711da1b87cc19e24ae72744266672de40
