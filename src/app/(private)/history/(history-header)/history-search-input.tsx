"use client";
import { Input } from "@/components/ui/input";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const HistorySearchInput = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState<string>(params.get("search") ?? "");

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
    <Input
      autoFocus
      defaultValue={search}
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
      prefixIcon={<SearchIcon stroke="gray" />}
    />
  );
};

export default HistorySearchInput;
