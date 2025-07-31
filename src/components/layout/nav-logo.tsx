"use client";

import * as React from "react";
import Link from "next/link";

import { LogoAlmohadaRey } from "@/assets/icons/LogoAlmohadaRey";
import { LogoAlmohadaReyMobile } from "@/assets/icons/LogoAlmohadaReyMobile";
import { useSidebar } from "../ui/sidebar";

export function NavLogo() {
  const { state } = useSidebar();

  return (
    <Link href="/" className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity">
      {state === "collapsed" ? (
        <LogoAlmohadaReyMobile height={35} width={35} />
      ) : (
        <LogoAlmohadaRey height={35} width={130} />
      )}
    </Link>
  );
}
