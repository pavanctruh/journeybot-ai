"use client";

export default function TripCard({ trip }: { trip: any }) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="font-bold text-lg">{trip?.title || "Trip"}</h3>
      <p>
        {trip?.fromCity} → {trip?.toCity}
      </p>
      <p>Days: {trip?.days}</p>
      <p>Budget: {trip?.budget}</p>
    </div>
  );
}
