import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getSettings);
router.route("/").put(verifyJWT, updateSettings);

export default router;