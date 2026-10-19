import { Router } from "express";
import { getRazorpayKey, createRazorpayOrder, verifyAndConfirmBooking } from "../controllers/payment.controller.js";

const router = Router();

router.route("/key").get(getRazorpayKey);
router.route("/create-order").post(createRazorpayOrder);
router.route("/verify-and-confirm").post(verifyAndConfirmBooking);

export default router;
