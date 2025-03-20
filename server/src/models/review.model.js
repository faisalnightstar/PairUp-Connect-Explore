import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the user who is giving the review
            required: true,
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the user who is being reviewed
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Review = mongoose.model("Review", reviewSchema);
