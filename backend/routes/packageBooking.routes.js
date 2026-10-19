import { Router } from "express";
import { createPackageBooking, getAllPackageBookings, updatePackageBookingStatus, deletePackageBooking } from "../controllers/packageBooking.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(createPackageBooking);
router.route("/").get(verifyJWT, getAllPackageBookings);
router.route("/:id").put(verifyJWT, updatePackageBookingStatus).delete(verifyJWT, deletePackageBooking);

export default router;