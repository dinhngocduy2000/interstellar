"use client";
import { Input } from "@/components/ui/input";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const HistoryHeaderComponent = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const { isMounted } = useDebounce({
    searchText: search,
    func: () => {
      router.push(`${ROUTE_PATH.HISTORY}?search=${search}`);
    },
  });
  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">History</h1>
      <Input
        autoFocus
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        prefixIcon={<SearchIcon stroke="gray" />}
      />
    </>
  );
};

export default HistoryHeaderComponent;
