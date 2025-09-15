import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";
import HomePageClientComponent from "./client-component";
import { getListConversations } from "@/lib/api/conversations";
import { getQueryClient } from "@/lib/queries/query-client";

const HomePage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["conversations"],
    queryFn: ({ signal }) =>
      getListConversations({ page: 1, limit: 10 }, signal),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClientComponent />
    </HydrationBoundary>
  );
};

export default HomePage;
