import React, { Suspense } from "react";
import AppLogoComponent from "@/components/reusable/app-logo-component";
import ChatInputComponent from "@/components/reusable/chat-input-component";

const HomePage = async () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <AppLogoComponent height={80} width={80} />
        <p className="font-semibold text-2xl text-primary">Interstellar</p>
      </div>
      <Suspense>
        <ChatInputComponent />
      </Suspense>
    </div>
  );
};

export default HomePage;
