import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import HomePageClientComponent from "./client-component";

const HomePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["test"],
    queryFn: () => "1",
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClientComponent />
    </HydrationBoundary>
  );
};

export default HomePage;
