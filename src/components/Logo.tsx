"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Logo({ navBar }: { navBar?: boolean }) {
  const { theme } = useTheme();
  const [logo, setLogo] = useState("/img/logo_final.png");

  useEffect(() => {
    setLogo(theme === "light" ? "/img/logo.png" : "/img/logo_final.png");
  }, [theme]);

  return (
    <Link href="/home" className="mr-6 flex items-center space-x-2">
      <Image src={logo} alt="Gymetry Logo" width={55} height={55} />

      <span
        className={`font-heading text-xl font-bold max-sm:${navBar ? "hidden" : ""}`}
      >
        <span className="text-brand">Gym</span>
        <span className="font-mono">etry💪</span>
      </span>
    </Link>
  );
}

export default Logo;
