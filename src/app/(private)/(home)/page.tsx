import AppLogoComponent from "@/components/reusable/app-logo-component";
import React, { Suspense } from "react";
import ChatInputComponent from "@/components/reusable/chat-input-component";

const HomePage = async () => {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-8 items-center p-4">
      <div className="gap-4 flex flex-col items-center">
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
