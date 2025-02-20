import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo({ navBar }: { navBar?: boolean }) {
  return (
    <Link href="/home" className="mr-6 flex items-center space-x-2">
      <Image
        src="/img/logo_final.png"
        alt="Gymetry Logo"
        width={55}
        height={55}
      />

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
