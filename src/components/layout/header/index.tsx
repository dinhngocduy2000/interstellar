import React from "react";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "./theme-toggle";
import { getQueryClient } from "@/lib/queries/query-client";
import { trackSession } from "@/lib/api/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
};
const HeaderComponent = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["track"],
    queryFn: ({ signal }) => trackSession(signal),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="flex h-16 pl-0 pr-4 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <p className="text-xl font-semibold">Interstellar</p>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <NavUser user={user} />
        </div>
      </header>
    </HydrationBoundary>
  );
};

export default HeaderComponent;
