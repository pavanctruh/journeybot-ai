"use client";

import React, { useState, useEffect } from "react";
import ChatBox from "@/app/create-new-trip/_components/ChatBox";
import EmptyBoxState from "@/app/create-new-trip/_components/EmptyBoxState";

export default function CreateNewTripPage() {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    console.log("PAGE RENDERED");
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] overflow-hidden">
      {showChat ? (
        <ChatBox onBack={() => setShowChat(false)} />
      ) : (
        <EmptyBoxState onStartChat={() => setShowChat(true)} />
      )}
    </div>
  );
}
