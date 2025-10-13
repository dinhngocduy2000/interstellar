import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trackSession } from "@/lib/api/auth";
import { getQueryClient } from "@/lib/queries/query-client";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "./theme-toggle";

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
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 pr-4 pl-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <p className="font-semibold text-xl">Interstellar</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NavUser user={user} />
        </div>
      </header>
    </HydrationBoundary>
  );
};

export default HeaderComponent;
