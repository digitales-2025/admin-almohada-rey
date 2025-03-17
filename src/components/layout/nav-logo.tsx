"use client";

import * as React from "react";
import Link from "next/link";

import { LogoAlmohadaRey } from "@/assets/icons/LogoAlmohadaRey";

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity">
      <LogoAlmohadaRey height={35} width={130} />
    </Link>
  );
}
