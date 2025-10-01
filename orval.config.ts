import { conversationAPIOrval } from "@/lib/orvals/conversation-orval";
import { usersAPIOrval } from "@/lib/orvals/users-orval";
import { defineConfig } from "orval";

export default defineConfig({
  conversationsAPI: conversationAPIOrval,
  usersAPI: usersAPIOrval,
});
