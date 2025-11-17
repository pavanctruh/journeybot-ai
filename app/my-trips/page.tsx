"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/api/my-trips");
        setTrips(res.data.trips || []);
      } catch (err) {
        console.error("❌ Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-gray-500">
        Loading your trips...
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Trips Yet
        </h2>
        <p className="text-gray-500">
          Start planning your next journey from the Create Trip page!
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">
        Your Saved Trips ✈️
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip: any, index) => (
          <TripCard key={index} trip={trip} />
        ))}
      </div>
    </div>
  );
}
