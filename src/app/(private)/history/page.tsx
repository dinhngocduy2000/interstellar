import React from "react";
import HistoryHeaderComponent from "./(history-header)";

const HistoryPage = () => {
  return (
    <div className="h-full md:w-4xl md:max-w-4xl max-w-full mx-auto p-4 flex flex-col gap-4">
      <HistoryHeaderComponent />
    </div>
  );
};

export default HistoryPage;
