import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/home" className="mr-6 flex items-center space-x-2">
      <span className="font-heading text-xl font-bold">
        <span className="text-brand">Gym</span>
        <span className="font-mono">etry💪</span>
      </span>
    </Link>
  );
}

export default Logo;
