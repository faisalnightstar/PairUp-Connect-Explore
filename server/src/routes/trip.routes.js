import {
    getAllTrip,
    getNearbyTrips,
    getUserTripHistory,
    joinTrip,
    postTrip,
    viewTripDetails,
} from "../controllers/trip.controller.js";

import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Post a trip (with image upload)
router
    .route("/post-trip")
    .post(verifyJWT, upload.single("coverImage"), postTrip);
router.route("/all-trips").get(getNearbyTrips);
router.route("/view-trip/:tripId").get(viewTripDetails);
router.route("/join-trip/:tripId").post(verifyJWT, joinTrip);
router.route("/nearby").get(getNearbyTrips);
router.route("/trips-history/:userId").get(getUserTripHistory);

export default router;
