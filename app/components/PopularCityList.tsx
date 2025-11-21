/*"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const data = [
  {
    category: "Beach",
    title: "Goa, India",
    src: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
    content: "A perfect beach escape!",
  },
  {
    category: "City",
    title: "New York, USA",
    src: "https://images.unsplash.com/photo-1499510318569-690eee7a0d6d",
    content: "The city that never sleeps",
  },
  {
    category: "Mountains",
    title: "Manali, India",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    content: "Peaceful mountain vibes",
  },
];

export default function PopularCityList() {
  // FIX: card spread + safe default content
  const cards = data.map((card, index) => (
    <Card
      key={index}
      card={{ ...card, content: card.content ?? "" }} // important fix!
      index={index}
    />
  ));

  return (
    <div className="w-full my-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        Popular Destinations
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
  */
