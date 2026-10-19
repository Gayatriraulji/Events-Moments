import { Router } from "express";
import { createReview, getApprovedReviews, getAllReviews, updateReviewStatus, deleteReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(createReview);
router.route("/approved").get(getApprovedReviews);
router.route("/all").get(verifyJWT, getAllReviews);
router.route("/:id").put(verifyJWT, updateReviewStatus).delete(verifyJWT, deleteReview);

export default router;