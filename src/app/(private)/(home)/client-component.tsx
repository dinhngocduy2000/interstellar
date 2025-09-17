"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { cn } from "@/lib/utils";
import { Ghost, Image, Navigation2, Newspaper } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function HomePageClientComponent() {
  const [chatText, setChatText] = useState<string>("");
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const isPrivate = params.get("private") === "true";

  const onChatSubmit = async () => {
    router.push(ROUTE_PATH.TASK);
  };
  return (
    <div className="w-full p-8 flex flex-col gap-4 justify-center">
      <form className="gap-2 min-h-[200px] md:max-w-4xl border border-ring rounded-xl max-w-full w-full bg-chat-foreground mx-auto flex flex-col">
        <Textarea
          rows={4}
          autoFocus
          onKeyUp={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onChatSubmit();
            }
          }}
          onChange={(e) => setChatText(e.target.value)}
          placeholder="Make yourself at home and ask away"
          className="flex-1 resize-none md:text-base field-sizing-fixed p-4 border-none shadow-none dark:bg-transparent focus-visible:border-none focus-visible:ring-0"
        />
        <div className="flex w-full h-fit p-4">
          <Button
            disabled={!chatText}
            type="submit"
            className="rounded-full ml-auto"
          >
            <Navigation2 className="rotate-90" />
          </Button>
        </div>
      </form>
      {pathname === ROUTE_PATH.HOME && (
        <div className="flex w-full justify-center gap-2">
          <Button className="rounded-2xl" variant={"outline"}>
            <Newspaper />
            Latest News
          </Button>
          <Button className="rounded-2xl" variant={"outline"}>
            <Image />
            Create Images
          </Button>
          <Button
            className={cn(
              "rounded-2xl",
              isPrivate
                ? "text-[#A08CED] border border-[#A08CED]"
                : "text-primary",
            )}
            variant={"outline"}
            onClick={() => {
              router.push(`${isPrivate ? "/" : "?private=true"}`);
            }}
          >
            <Ghost />
            Private
          </Button>
        </div>
      )}
    </div>
  );
}
