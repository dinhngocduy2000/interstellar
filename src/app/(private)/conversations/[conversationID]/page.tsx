import ConversationClientComponent from "./client-component";

const ConversationPage = async ({
  params,
}: {
  params: Promise<{ conversationID: string }>;
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-auto">
      <ConversationClientComponent params={params} />
    </div>
  );
};

export default ConversationPage;
