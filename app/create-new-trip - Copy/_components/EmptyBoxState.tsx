"use client";

import React from "react";
import { Compass, PlusCircle, Map, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyBoxState({
  onStartChat,
}: {
  onStartChat: () => void;
}) {
  const suggestions = [
    {
      icon: <Plane className="w-6 h-6 text-blue-500" />,
      title: "Plan a New Trip",
      description: "Start planning your next journey powered by AI.",
    },
    {
      icon: <Compass className="w-6 h-6 text-emerald-500" />,
      title: "Explore Destinations",
      description: "Discover top-rated cities, attractions, and ideas.",
    },
    {
      icon: <Map className="w-6 h-6 text-purple-500" />,
      title: "View on Global Map",
      description: "Visualize places with an interactive 3D map.",
    },
    {
      icon: <PlusCircle className="w-6 h-6 text-orange-500" />,
      title: "Create Custom Itinerary",
      description: "Build your own plan with preferred spots.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          No Trips Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          You haven’t planned any trips yet — get started with one of these:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white/70 dark:bg-gray-900/70 backdrop-blur"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {item.icon}
                <h3 className="font-medium text-orange-500 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
                <Button onClick={onStartChat} className="mt-2 rounded-xl">
                  Chat with AI
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
