import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
    {
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        categories: {
            type: String,
            //required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        numberOfPeople: {
            type: Number,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        itinerary: [
            {
                day: String,
                activity: String,
            },
        ],
        // images: {
        //     type: String, // Cloudinary image URLs
        // },
        coverImage: {
            type: String, // cloudinary URL
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                unique: true,
            },
        ],
    },
    { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);
