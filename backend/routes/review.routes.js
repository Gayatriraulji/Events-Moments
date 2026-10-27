import { Router } from "express";
import { createReview, getApprovedReviews, getAllReviews, updateReview, deleteReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(createReview);
router.route("/approved").get(getApprovedReviews);
router.route("/all").get(getAllReviews);
router.route("/:id").put(updateReview).delete(deleteReview);

export default router;