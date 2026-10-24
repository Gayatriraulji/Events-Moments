import { Router } from "express";
import { createService, getAllServices, getServiceById, updateService, deleteService } from "../controllers/service.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(getAllServices);
router.route("/").post(verifyJWT, upload.single("image"), createService);
router.route("/:id").get(getServiceById);
router.route("/:id").put(verifyJWT, upload.single("image"), updateService).delete(verifyJWT, deleteService);

export default router;
