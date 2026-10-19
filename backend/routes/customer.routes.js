import { Router } from "express";
import { sendOtp, verifyOtp, getMyBookings } from "../controllers/customer.controller.js";
import { verifyCustomer } from "../middleware/customer.middleware.js";

const router = Router();

router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/my-bookings").get(verifyCustomer, getMyBookings);

export default router;