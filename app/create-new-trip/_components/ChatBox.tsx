"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("./TripMap"), { ssr: false });

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
  //  state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [tripData, setTripData] = useState<any>(null);
  const [data, setData] = useState<Collected>({});
  const [busy, setBusy] = useState(false);

  //  refs/helpers
  const chatRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const initialized = useRef(false);

  const genId = (p = "m") => `${p}_${++idCounter.current}`;
  const append = (m: Message | Message[]) =>
    setMessages((prev) => [...prev, ...(Array.isArray(m) ? m : [m])]);

  // auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // initial greeting
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    append({
      id: genId("hello"),
      role: "bot",
      text: "👋 Hi! I’m your AI trip assistant. Let’s plan your journey step by step!",
    });
    askStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Steps definition
  const steps = useMemo(
    () => [
      {
        key: "route",
        ask: (): Message => ({
          id: "q_route",
          role: "bot",
          text: "Where are you travelling from and to?\n\nExample: `Hyderabad to Goa` or choose below.",
          options: [
            {
              label: "Hyderabad → Goa",
              icon: <MapPin className="w-4 h-4 text-blue-500" />,
            },
            {
              label: "Delhi → Jaipur",
              icon: <MapPin className="w-4 h-4 text-pink-500" />,
            },
            {
              label: "Bengaluru → Mumbai",
              icon: <MapPin className="w-4 h-4 text-green-500" />,
            },
            {
              label: "Chennai → Kochi",
              icon: <MapPin className="w-4 h-4 text-purple-500" />,
            },
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
            {
              label: "Just me",
              icon: <User className="w-4 h-4 text-blue-400" />,
            },
            {
              label: "Family",
              icon: <Home className="w-4 h-4 text-yellow-400" />,
            },
            {
              label: "Friends",
              icon: <Users className="w-4 h-4 text-green-400" />,
            },
            {
              label: "Couples",
              icon: <Heart className="w-4 h-4 text-pink-500" />,
            },
          ],
        }),
        handle: (answer: string) =>
          setData((d) => ({ ...d, peopleType: answer.toLowerCase() })),
      },
      {
        key: "budget",
        ask: (): Message => ({
          id: "q_budget",
          role: "bot",
          text: "Choose your budget type:",
          options: [
            {
              label: "Cheap",
              icon: <IndianRupeeIcon className="w-4 h-4 text-green-500" />,
            },
            {
              label: "Moderate",
              icon: <IndianRupeeIcon className="w-4 h-4 text-yellow-500" />,
            },
            {
              label: "Luxury",
              icon: <IndianRupeeIcon className="w-4 h-4 text-purple-500" />,
            },
          ],
        }),
        handle: (answer: string) =>
          setData((d) => ({ ...d, budget: answer.toLowerCase() })),
      },
      {
        key: "tripType",
        ask: (): Message => ({
          id: "q_triptype",
          role: "bot",
          text: "What kind of experiences are you looking for?",
          options: [
            {
              label: "Sightseeing",
              icon: <Compass className="w-4 h-4 text-sky-500" />,
            },
            {
              label: "Adventure",
              icon: <Mountain className="w-4 h-4 text-red-500" />,
            },
            {
              label: "Food",
              icon: <Utensils className="w-4 h-4 text-yellow-500" />,
            },
            {
              label: "Nightlife",
              icon: <Moon className="w-4 h-4 text-purple-500" />,
            },
            {
              label: "All",
              icon: <MapPin className="w-4 h-4 text-green-500" />,
            },
          ],
        }),
        handle: (answer: string) =>
          setData((d) => ({ ...d, tripType: answer.toLowerCase() })),
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
        handle: (answer: string) => {
          const n = parseInt(answer.replace(/\D/g, ""), 10) || 3;
          setData((d) => ({ ...d, days: n }));
        },
      },
    ],
    []
  );

  // Step / message helpers
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
    const current = steps[step];
    append({ id: genId("user"), role: "user", text });
    current?.handle(text);
    setTimeout(() => advance(), 100);
  }

  // final confirmation summary
  function confirm() {
    const summary = `✨ A ${data.days}-day ${data.peopleType} trip from ${data.fromCity} to ${data.toCity} with a ${data.budget} budget focused on ${data.tripType} experiences.`;
    append({ id: genId("summary"), role: "bot", text: summary });
    append({
      id: genId("confirm"),
      role: "bot",
      text: "Would you like me to generate your full itinerary now?",
      options: [{ label: "Yes, generate" }],
    });
  }

  // AI Generation
  async function handleConfirm() {
    setBusy(true);
    append({
      id: genId("bot"),
      role: "bot",
      text: "🧠 Generating itinerary with AI... please wait a moment.",
    });

    console.log("📤 Sending request to /api/aimodel...");

    try {
      const res = await fetch("/api/aimodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFinal: true,
          messages: [
            {
              role: "user",
              content: `Plan a ${data.days}-day ${data.tripType} trip from ${data.fromCity} to ${data.toCity} for a ${data.peopleType} group with a ${data.budget} budget.
Include coordinates, hotels, total cost, per-person cost, and daily itinerary.`,
            },
          ],
        }),
      });

      const result = await res.json();
      console.log("📩 Trip Response:", result);

      if (result.trip_plan) {
        setTripData(result.trip_plan);
        append({
          id: genId("done"),
          role: "bot",
          text: "✅ Your itinerary is ready! Check the map and summary below 👇",
        });
      } else {
        append({
          id: genId("fail"),
          role: "bot",
          text: `⚠️ Unable to generate trip plan.\n\n${
            result.error || "Please try again."
          }`,
        });
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      append({
        id: genId("error"),
        role: "bot",
        text: "❌ Something went wrong. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  // Render helpers (kept simple)
  const renderMessage = (m: Message) => (
    <div
      key={m.id}
      className={`mb-3 p-3 rounded-xl max-w-[80%] ${
        m.role === "bot" ? "bg-gray-100 text-gray-800" : "bg-orange-100 ml-auto"
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
  );

  // JSX
  return (
    <div className="flex w-full h-[calc(100vh-4.5rem)] overflow-hidden">
      {/* Left Side — Chat */}
      <div className="w-1/2 flex flex-col p-4 border-r overflow-y-auto">
        <div ref={chatRef} className="flex-1 overflow-y-auto p-2">
          {messages.map(renderMessage)}

          {/* Trip Summary */}
          {tripData && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-500" />
                Trip Summary
              </h3>

              {tripData.itinerary?.map((day: any) => (
                <div key={day.day} className="mb-3">
                  <p className="font-semibold">
                    Day {day.day}: {day.day_plan}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {day.activities?.map((act: any, i: number) => (
                      <li key={i}>
                        <strong>{act.place_name}</strong>: {act.place_details}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {tripData.hotels && (
                <>
                  <h4 className="font-semibold flex items-center gap-2 mt-3">
                    <Hotel className="w-4 h-4 text-green-600" /> Hotels for Stay
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {tripData.hotels.map((h: any, i: number) => (
                      <li key={i}>
                        {h.hotel_name} — {h.hotel_address} ({h.price_per_night})
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2 mt-4">
          <Textarea
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleAnswer(input.trim());
                  setInput("");
                }
              }
            }}
          />
          <Button
            onClick={() => {
              if (input.trim()) {
                handleAnswer(input.trim());
                setInput("");
              }
            }}
            disabled={busy}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Side — Map */}
      <div className="w-1/2">
        <TripMap tripData={tripData} />
      </div>
    </div>
  );
}
