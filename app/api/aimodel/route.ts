import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import arcjet, { tokenBucket } from "@arcjet/next";


// OpenRouter Client

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});


// Arcjet Rate-Limiting
const aj = arcjet({
  key: process.env.ARCJET_KEY || "",
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});


// MAIN FINAL JSON PROMPT 
const FINAL_PROMPT = `
You are an expert Indian travel planner.

Return ONLY valid JSON — no markdown, no code fences, and no text outside JSON.

Your JSON must strictly follow this structure:

{
  "trip_plan": {
    "origin": "string",
    "destination": "string",
    "origin_coordinates": { "latitude": number, "longitude": number },
    "destination_coordinates": { "latitude": number, "longitude": number },
    "duration": "string (like '5 days')",
    "group_size": "string",
    "budget": "string",
    "trip_type": "string",
    "total_cost": number,
    "cost_per_person": number,
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string (₹xxxx)",
        "geo_coordinates": { "latitude": number, "longitude": number },
        "rating": number
      }
    ],
    "itinerary": [
      {
        "day": number,
        "day_plan": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "geo_coordinates": { "latitude": number, "longitude": number },
            "place_image_url": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}

Rules:
- Always generate at least 3 hotels.
- Include a full {days}-day itinerary.
- Use real Indian coordinates and INR ₹ prices.
- Keep cost realistic:
  - Cheap: ₹15,000–₹30,000 total
  - Moderate: ₹40,000–₹80,000 total
  - Luxury: ₹100,000–₹250,000 total
- Calculate per-person cost = total_cost / number of travellers (approx).
- No markdown, no explanation, no \`\`\` — return pure JSON.
`;


//  POST ROUTE
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 1. Authenticate user
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const userId = clerkUser.id;

    // 2. Arcjet protection
    const decision = await aj.protect(req, { userId, requested: 1 });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 3. Get request data
    const { messages, isFinal } = await req.json();
    const systemPrompt = isFinal
      ? FINAL_PROMPT
      : "You are a helpful AI travel assistant.";

    console.log(" Generating itinerary using OpenRouter...");

    // 4. OpenRouter API Call 
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // api model we are using
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const raw = completion?.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    // 5. Clean JSON
    let cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .replace(/\\n/g, " ")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      console.log("RAW OUTPUT START >>", cleaned.slice(0, 800), "<< END RAW OUTPUT");
      return NextResponse.json(
        {
          error: "Invalid JSON returned from AI",
          raw: cleaned.slice(0, 800),
        },
        { status: 500 }
      );
    }

    if (!parsed.trip_plan) {
      return NextResponse.json(
        { error: "No trip_plan found in AI response", raw: parsed },
        { status: 500 }
      );
    }

    // 6. Apply fallbacks
    const tp = parsed.trip_plan;
    tp.duration = tp.duration || "5 days";
    tp.total_cost = tp.total_cost || 25000;
    tp.cost_per_person = tp.cost_per_person || 12500;

    // 7. Save trip in MongoDB
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        name: clerkUser.fullName || "Unknown User",
        email: clerkUser.primaryEmailAddress?.emailAddress,
        picture: clerkUser.imageUrl,
        trips: [],
      });
    }

    user.trips.push(tp);
    await user.save();

    console.log("📌 Trip saved for:", clerkUser.fullName);

    return NextResponse.json({ trip_plan: tp });
  } catch (error: any) {
    console.error("❌ Trip generation failed:", error.message);
    return NextResponse.json(
      { error: "Trip generation failed", details: error.message },
      { status: 500 }
    );
  }
}


//GET ROUTE
export async function GET() {
  return NextResponse.json({
    message: "AI Trip Planner API Running",
  });
}
