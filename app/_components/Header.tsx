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
