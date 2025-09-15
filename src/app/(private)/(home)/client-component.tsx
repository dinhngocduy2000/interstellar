"use client";

import { getListConversations } from "@/lib/api/conversations";
import { useQuery } from "@tanstack/react-query";

export default function HomePageClientComponent() {
  useQuery({
    queryKey: ["conversations"],
    queryFn: ({ signal }) =>
      getListConversations({ page: 1, limit: 10 }, signal),
  });
  return (
    <div className="h-full bg-background p-6 max-w-7xl mx-auto flex flex-col">
      <p>Test</p>
    </div>
  );
}
