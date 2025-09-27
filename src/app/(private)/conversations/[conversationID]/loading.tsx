import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="size-6" />
      ))}
    </div>
  );
}
