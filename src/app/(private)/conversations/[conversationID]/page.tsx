export const revalidate = 0; // Revalidate immediately (no caching)

import React from "react";
import ConversationClientComponent from "./client-component";

const ConversationPage = async ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  return (
    <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
      <ConversationClientComponent params={params} />
    </div>
  );
};

export default ConversationPage;
