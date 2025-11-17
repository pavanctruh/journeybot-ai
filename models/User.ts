import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, unique: true },
    name: String,
    email: String,
    picture: String,
    trips: [
      {
        destination: String,
        duration: String,
        origin: String,
        budget: String,
        group_size: String,
        hotels: [
          {
            hotel_name: String,
            hotel_address: String,
            price_per_night: String,
            hotel_image_url: String,
            rating: Number,
            description: String,
            geo_coordinates: { latitude: Number, longitude: Number },
          },
        ],
        itinerary: [
          {
            day: Number,
            day_plan: String,
            activities: [
              {
                place_name: String,
                place_details: String,
                place_image_url: String,
                place_address: String,
                geo_coordinates: { latitude: Number, longitude: Number },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
