import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/" className="mr-6 flex items-center space-x-2">
      <span className="text-xl font-bold">
        <span className="text-orange-500">Gym</span>
        <span className="font-mono">etry💪</span>
      </span>
    </Link>
  );
}

export default Logo;
