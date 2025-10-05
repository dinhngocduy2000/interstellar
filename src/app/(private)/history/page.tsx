import HistoryHeaderComponent from "./(history-header)";
import ListConversationHistory from "./(list-history-conversations)";

const HistoryPage = async () => {
  return (
    <div className="h-full md:w-4xl md:max-w-4xl max-w-full mx-auto p-4 flex flex-col gap-4">
      <HistoryHeaderComponent />
      <ListConversationHistory />
    </div>
  );
};

export default HistoryPage;
