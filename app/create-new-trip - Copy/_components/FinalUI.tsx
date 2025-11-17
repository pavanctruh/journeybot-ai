"use client";

import React from "react";

interface TripPlan {
  destination?: string;
  origin?: string;
  duration?: string;
  budget?: string;
  group_size?: string;
  hotels?: {
    hotel_name: string;
    hotel_address: string;
    price_per_night?: string;
    rating?: number;
    hotel_image_url?: string;
  }[];
  itinerary?: {
    day: number;
    day_plan: string;
    activities: {
      place_name: string;
      place_details: string;
      place_image_url?: string;
      best_time_to_visit?: string;
    }[];
  }[];
}

export default function FinalUI({ tripData }: { tripData?: TripPlan }) {
  if (!tripData)
    return (
      <div className="p-4 text-gray-500 text-sm italic">
        No trip data found. Please try again.
      </div>
    );

  return (
    <div className="space-y-6">
      {/*  HEADER */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-1">
          ✈️ Trip from {tripData.origin || "Your City"} to{" "}
          {tripData.destination || "Destination"}
        </h2>
        <p className="text-sm opacity-90">
          {tripData.duration || "N/A"} days • {tripData.group_size || "Group"} •{" "}
          {tripData.budget || "Budget"}
        </p>
      </div>

      {/* 🏨 HOTELS */}
      {tripData.hotels && tripData.hotels.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3 text-orange-600">
            🏨 Recommended Hotels
          </h3>
          <div className="grid gap-4">
            {tripData.hotels.map((hotel, idx) => (
              <div
                key={idx}
                className="flex gap-4 border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                {hotel.hotel_image_url && (
                  <img
                    src={hotel.hotel_image_url}
                    alt={hotel.hotel_name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {hotel.hotel_name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {hotel.hotel_address}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    💰 {hotel.price_per_night || "N/A"} | ⭐{" "}
                    {hotel.rating || "N/A"}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🗓️ ITINERARY */}
      {tripData.itinerary && tripData.itinerary.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3 text-orange-600">
            🗓️ Daily Itinerary
          </h3>
          <div className="space-y-4">
            {tripData.itinerary.map((day, idx) => (
              <div
                key={idx}
                className="border rounded-xl bg-gray-50 p-4 shadow-sm"
              >
                <h4 className="font-semibold text-gray-800 mb-1">
                  Day {day.day}: {day.day_plan}
                </h4>

                <div className="grid gap-3 mt-2">
                  {day.activities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm"
                    >
                      {act.place_image_url && (
                        <img
                          src={act.place_image_url}
                          alt={act.place_name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {act.place_name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {act.place_details}
                        </p>
                        {act.best_time_to_visit && (
                          <p className="text-xs text-gray-500 mt-1">
                            ⏰ Best time: {act.best_time_to_visit}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/*  FALLBACK */}
      {!tripData.itinerary?.length && !tripData.hotels?.length && (
        <div className="text-gray-500 text-sm italic">
          Trip details will appear here once generated.
        </div>
      )}
    </div>
  );
}
