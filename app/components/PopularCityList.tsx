"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const data = [
  {
    category: "Paris, France",
    title: "Explore the City of Lights – Eiffel Tower, Louvre & more",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1080&auto=format&fit=crop",
  },
  {
    category: "New York, USA",
    title: "Experience NYC – Times Square, Central Park, Broadway",
    src: "https://images.unsplash.com/photo-1526401485004-2aa7c5a99d66?q=80&w=1080&auto=format&fit=crop",
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Tokyo – Shibuya, Cherry Blossoms, Temples",
    src: "https://images.unsplash.com/photo-1505069442587-6f46a04bcb4b?q=80&w=1080&auto=format&fit=crop",
  },
  {
    category: "Rome, Italy",
    title: "Walk through History – Colosseum, Trevi Fountain, Romance",
    src: "https://images.unsplash.com/photo-1549887534-4c1d9f06b8b5?q=80&w=1080&auto=format&fit=crop",
  },
  {
    category: "Goa, India",
    title: "Relax by the Beach – Sunsets, Music, and Serenity",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1080&auto=format&fit=crop",
  },
];

export default function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card
      key={index}
      card={{ ...card, content: "Travel now!" }}
      index={index}
    />
  ));

  return (
    <div className="w-full py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-orange-600">
        Explore Popular Destinations
      </h2>

      <div className="w-full h-[480px] flex items-center justify-center overflow-visible">
        <Carousel items={cards} />
      </div>
    </div>
  );
}
