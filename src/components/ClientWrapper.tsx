"use client";

import { useCollapseState } from "@/store/collapseState";
import React from "react";

function ClientWrapper({ children }: { children: React.ReactNode }) {
  const collapsed = useCollapseState((state) => state.collapse);

  return (
    <div
      className="parent flex flex-1"
      data-collapsed={collapsed ? "true" : "false"}
    >
      {children}
    </div>
  );
}

export default ClientWrapper;
