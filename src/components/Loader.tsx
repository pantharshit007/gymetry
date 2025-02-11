import type React from "react";
import { Card } from "@/components/ui/card";

function Loader({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Card className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-4 p-6">
        {/* <div className="flex items-center justify-center space-x-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-[#f97316]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-[#f97316] delay-150"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-[#f97316] delay-300"></div>
        </div> */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-[#f97316] border-opacity-50"></div>
      </Card>
    </div>
  );
}

export default Loader;
