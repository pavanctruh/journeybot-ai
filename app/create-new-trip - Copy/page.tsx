"use client";

import React, { useState } from "react";
import EmptyBoxState from "./_components/EmptyBoxState";
import ChatBox from "./_components/ChatBox";

export default function CreateNewTripPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] overflow-hidden">
      {!showChat ? (
        <EmptyBoxState onStartChat={() => setShowChat(true)} />
      ) : (
        <ChatBox onBack={() => setShowChat(false)} />
      )}
    </div>
  );
}
