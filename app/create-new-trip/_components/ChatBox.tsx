"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  User,
  Users,
  Heart,
  Home,
  IndianRupeeIcon,
  MapPin,
  Utensils,
  Compass,
  Mountain,
  Moon,
  CalendarDays,
  Hotel,
} from "lucide-react";

type Role = "bot" | "user";
type Message = {
  id: string;
  role: Role;
  text: string;
  options?: { label: string; icon?: JSX.Element }[];
};

type Collected = {
  fromCity?: string;
  toCity?: string;
  peopleType?: string;
  budget?: string;
  days?: number;
  tripType?: string;
};

export default function ChatBox({ onBack }: { onBack?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [tripData, setTripData] = useState<any>(null);
  const [data, setData] = useState<Collected>({});
  const [busy, setBusy] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const initialized = useRef(false);

  const genId = (p = "m") => `${p}_${++idCounter.current}`;
  const append = (m: Message | Message[]) =>
    setMessages((prev) => [...prev, ...(Array.isArray(m) ? m : [m])]);

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    append({
      id: genId("hello"),
      role: "bot",
      text: "👋 Hi! I’m your AI trip assistant. Let’s plan your journey step by step!",
    });

    askStep(0);
  }, []);

  // Steps
  const steps = useMemo(
    () => [
      {
        key: "route",
        ask: (): Message => ({
          id: "q_route",
          role: "bot",
          text: "Where are you travelling from and to?\n\nExample: `Hyderabad to Goa` or choose below.",
          options: [
            { label: "Hyderabad → Goa", icon: <MapPin /> },
            { label: "Delhi → Jaipur", icon: <MapPin /> },
            { label: "Bengaluru → Mumbai", icon: <MapPin /> },
            { label: "Chennai → Kochi", icon: <MapPin /> },
          ],
        }),
        handle: (answer: string) => {
          const parts = answer
            .replace(/→/g, "to")
            .split("to")
            .map((p) => p.trim());
          setData((d) => ({ ...d, fromCity: parts[0], toCity: parts[1] }));
        },
      },
      {
        key: "peopleType",
        ask: (): Message => ({
          id: "q_people",
          role: "bot",
          text: "Who are you travelling with?",
          options: [
            { label: "Just me", icon: <User /> },
            { label: "Family", icon: <Home /> },
            { label: "Friends", icon: <Users /> },
            { label: "Couples", icon: <Heart /> },
          ],
        }),
        handle: (answer: string) =>
          setData((d) => ({ ...d, peopleType: answer })),
      },
      {
        key: "budget",
        ask: (): Message => ({
          id: "q_budget",
          role: "bot",
          text: "Choose your budget type:",
          options: [
            { label: "Cheap", icon: <IndianRupeeIcon /> },
            { label: "Moderate", icon: <IndianRupeeIcon /> },
            { label: "Luxury", icon: <IndianRupeeIcon /> },
          ],
        }),
        handle: (answer: string) => setData((d) => ({ ...d, budget: answer })),
      },
      {
        key: "tripType",
        ask: (): Message => ({
          id: "q_triptype",
          role: "bot",
          text: "What kind of experiences are you looking for?",
          options: [
            { label: "Sightseeing", icon: <Compass /> },
            { label: "Adventure", icon: <Mountain /> },
            { label: "Food", icon: <Utensils /> },
            { label: "Nightlife", icon: <Moon /> },
            { label: "All", icon: <MapPin /> },
          ],
        }),
        handle: (answer: string) =>
          setData((d) => ({ ...d, tripType: answer })),
      },
      {
        key: "days",
        ask: (): Message => ({
          id: "q_days",
          role: "bot",
          text: "How many days would you like to travel?",
          options: [
            { label: "3 days" },
            { label: "5 days" },
            { label: "7 days" },
          ],
        }),
        handle: (answer: string) =>
          setData((d) => ({
            ...d,
            days: parseInt(answer.replace(/\D/g, ""), 10) || 3,
          })),
      },
    ],
    []
  );

  function askStep(i: number) {
    const base = steps[i]?.ask();
    if (base) append(base);
  }

  function advance() {
    const next = step + 1;
    setStep(next);
    if (next < steps.length) askStep(next);
    else confirm();
  }

  function handleAnswer(text: string) {
    append({ id: genId("user"), role: "user", text });
    steps[step]?.handle(text);
    setTimeout(() => advance(), 100);
  }

  function confirm() {
    append({
      id: genId("summary"),
      role: "bot",
      text: `✨ A ${data.days}-day ${data.peopleType} trip from ${data.fromCity} to ${data.toCity} with a ${data.budget} budget focused on ${data.tripType} experiences.`,
    });

    append({
      id: genId("confirm"),
      role: "bot",
      text: "Would you like me to generate your full itinerary now?",
      options: [{ label: "Yes, generate" }],
    });
  }

  async function handleConfirm() {
    setBusy(true);
    append({
      id: genId("bot"),
      role: "bot",
      text: "🧠 Generating itinerary with AI... please wait...",
    });

    try {
      const res = await fetch("/api/aimodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFinal: true,
          messages: [
            {
              role: "user",
              content: `Plan a ${data.days}-day ${data.tripType} trip from ${data.fromCity} to ${data.toCity} for ${data.peopleType} with ${data.budget} budget.`,
            },
          ],
        }),
      });

      const result = await res.json();

      if (result.trip_plan) {
        setTripData(result.trip_plan);
        append({
          id: genId("done"),
          role: "bot",
          text: "✅ Your itinerary is ready! Check below 👇",
        });
      } else {
        append({
          id: genId("fail"),
          role: "bot",
          text: "⚠️ Failed to generate trip.",
        });
      }
    } catch {
      append({
        id: genId("error"),
        role: "bot",
        text: "❌ Something went wrong.",
      });
    }

    setBusy(false);
  }

  return (
    <div className="flex w-full h-[calc(100vh-4.5rem)] overflow-hidden">
      {/* LEFT SIDE - CHAT UI */}
      <div className="w-1/2 flex flex-col p-4 border-r overflow-y-auto">
        <div ref={chatRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-3 p-3 rounded-xl max-w-[80%] ${
                m.role === "bot"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-orange-100 ml-auto"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              {m.options && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {m.options.map((opt) => (
                    <Button
                      key={opt.label}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        m.text.includes("generate")
                          ? handleConfirm()
                          : handleAnswer(opt.label)
                      }
                    >
                      {opt.icon}
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* TRIP SUMMARY */}
          {tripData && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold flex items-center gap-2">
                <CalendarDays /> Trip Summary
              </h3>

              {tripData.itinerary?.map((day: any) => (
                <div key={day.day} className="mt-3">
                  <p>
                    <strong>Day {day.day}:</strong> {day.day_plan}
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    {day.activities.map((a: any, i: number) => (
                      <li key={i}>
                        {a.place_name}: {a.place_details}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHAT INPUT */}
        <div className="flex items-center gap-2 mt-4">
          <Textarea
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleAnswer(input)
            }
          />
          <Button onClick={() => handleAnswer(input)} disabled={busy}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 🚀 RIGHT SIDE EMPTY FOR FUTURE MAP */}
      <div className="w-1/2 flex justify-center items-center text-gray-400">
        {/* <TripMap tripData={tripData} />  <-- Later add here */}
        <p>🗺️ Map will be added here later</p>
      </div>
    </div>
  );
}
