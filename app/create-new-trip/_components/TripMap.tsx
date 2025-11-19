"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

//  Auto fit the map bounds when data updates
function AutoFitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length > 1) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  return null;
}

//  Fetch driving route using OSRM (Free API)
async function getDrivingRoute(
  from: [number, number],
  to: [number, number]
): Promise<[number, number][]> {
  try {
    const query = `${from[1]},${from[0]};${to[1]},${to[0]}`;
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates.map((c: number[]) => [
        c[1],
        c[0],
      ]);
    }
  } catch (err) {
    console.warn("⚠️ OSRM route fetch failed:", err);
  }
  return [from, to];
}

export default function TripMap({ tripData }: { tripData?: any }) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    async function prepareRoute() {
      if (!tripData) return;

      // ✅ Extract main origin/destination coords
      const from: [number, number] = [
        tripData.origin_coordinates?.latitude ?? 19.076,
        tripData.origin_coordinates?.longitude ?? 72.8777,
      ];
      const to: [number, number] = [
        tripData.destination_coordinates?.latitude ?? 15.2993,
        tripData.destination_coordinates?.longitude ?? 74.124,
      ];

      // ✅ Get realistic route using OSRM
      const drivingRoute = await getDrivingRoute(from, to);
      setRouteCoords(drivingRoute);
    }

    prepareRoute();
  }, [tripData]);

  if (!tripData)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        🗺️ Map will appear here once your itinerary is generated.
      </div>
    );

  //  Hotel coordinates
  const hotels =
    tripData.hotels
      ?.filter((h: any) => h.geo_coordinates)
      .map((h: any) => [
        h.geo_coordinates.latitude,
        h.geo_coordinates.longitude,
      ]) || [];

  //  Activity coordinates
  const activities =
    tripData.itinerary?.flatMap((d: any) =>
      d.activities
        ?.filter((a: any) => a.geo_coordinates)
        .map((a: any) => [
          a.geo_coordinates.latitude,
          a.geo_coordinates.longitude,
        ])
    ) || [];

  const allCoords = [
    ...hotels,
    ...activities,
    routeCoords?.[0],
    routeCoords?.[routeCoords.length - 1],
  ].filter(Boolean);

  // Default center: origin if available, else fallback
  const center =
    routeCoords.length > 0
      ? routeCoords[0]
      : [
          tripData.origin_coordinates?.latitude ?? 19.076,
          tripData.origin_coordinates?.longitude ?? 72.8777,
        ];

  //  Map icons
  const startIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/0/619.png",
    iconSize: [35, 35],
  });
  const endIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
    iconSize: [35, 35],
  });
  const hotelIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2331/2331941.png",
    iconSize: [25, 25],
  });
  const activityIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [22, 22],
  });

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={true}
      className="w-full h-full rounded-lg shadow-md border"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />

      {/*  Fit view to bounds */}
      <AutoFitBounds coordinates={allCoords as [number, number][]} />

      {/*  Draw driving route */}
      {routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          color="orange"
          weight={4}
          opacity={0.8}
        />
      )}

      {/*  Start Marker */}
      {routeCoords[0] && (
        <Marker position={routeCoords[0]} icon={startIcon}>
          <Popup>Start: {tripData.origin}</Popup>
        </Marker>
      )}

      {/*  Hotels */}
      {tripData.hotels?.map((h: any, i: number) =>
        h.geo_coordinates ? (
          <Marker
            key={`hotel-${i}`}
            position={[h.geo_coordinates.latitude, h.geo_coordinates.longitude]}
            icon={hotelIcon}
          >
            <Popup>
              <strong>{h.hotel_name}</strong>
              <br />
              {h.hotel_address}
              <br />⭐ {h.rating} | {h.price_per_night}
            </Popup>
          </Marker>
        ) : null
      )}

      {/*  Activities */}
      {tripData.itinerary?.map((day: any, dayIdx: number) =>
        day.activities?.map((act: any, actIdx: number) =>
          act.geo_coordinates ? (
            <Marker
              key={`act-${dayIdx}-${actIdx}`}
              position={[
                act.geo_coordinates.latitude,
                act.geo_coordinates.longitude,
              ]}
              icon={activityIcon}
            >
              <Popup>
                <strong>
                  Day {day.day}: {act.place_name}
                </strong>
                <br />
                {act.place_details}
                <br />
                <em>Best time: {act.best_time_to_visit}</em>
              </Popup>
            </Marker>
          ) : null
        )
      )}

      {/*  End Marker */}
      {routeCoords.length > 1 && (
        <Marker position={routeCoords[routeCoords.length - 1]} icon={endIcon}>
          <Popup>Destination: {tripData.destination}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
