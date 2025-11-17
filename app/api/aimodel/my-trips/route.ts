import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

//  GET all trips for the current authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = await User.findOne({ clerkId: clerkUser.id });

    if (!user)
      return NextResponse.json({ message: "No user found" }, { status: 404 });

    if (!user.trips || user.trips.length === 0)
      return NextResponse.json({ message: "No trips saved yet", trips: [] });

    return NextResponse.json({ trips: user.trips });
  } catch (error: any) {
    console.error(" Error fetching trips:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch trips", details: error.message },
      { status: 500 }
    );
  }
}

//  Optional: POST (for saving custom trip if needed later)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { trip_plan } = await req.json();
    if (!trip_plan)
      return NextResponse.json({ error: "Trip data missing" }, { status: 400 });

    let user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      user = await User.create({
        clerkId: clerkUser.id,
        name: clerkUser.fullName || "Unknown User",
        email: clerkUser.primaryEmailAddress?.emailAddress,
        picture: clerkUser.imageUrl,
        trips: [],
      });
    }

    user.trips.push(trip_plan);
    await user.save();

    return NextResponse.json({ message: "Trip saved successfully ✅" });
  } catch (error: any) {
    console.error(" Error saving trip:", error.message);
    return NextResponse.json(
      { error: "Failed to save trip", details: error.message },
      { status: 500 }
    );
  }
}
