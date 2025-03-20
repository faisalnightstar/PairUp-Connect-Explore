import {
    createReview,
    getAllReviews,
    getRatings,
} from "../controllers/review.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/post-review/:revieweeId").post(verifyJWT, createReview);
router.route("/all-reviews/:revieweeId").get(getAllReviews); // get all reviews/comments
router.route("/all-ratings/:revieweeId").get(getRatings); // get all ratings/stars

export default router;
