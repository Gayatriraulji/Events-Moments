import { Router } from "express";
import { createBooking, getAllBookings, updateBookingStatus, deleteBooking } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(createBooking);
router.route("/").get(verifyJWT, getAllBookings);
router.route("/:id").put(verifyJWT, updateBookingStatus).delete(verifyJWT, deleteBooking);

export default router;