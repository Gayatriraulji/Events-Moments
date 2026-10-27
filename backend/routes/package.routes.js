import { Router } from "express";
import { createPackage, createCustomPackage, getAllPackages, getPackageById, updatePackage, deletePackage } from "../controllers/package.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(getAllPackages);
router.route("/").post(verifyJWT, upload.single("image"), createPackage);
router.route("/custom").post(createCustomPackage);
router.route("/:id").get(getPackageById);
router.route("/:id").put(verifyJWT, upload.single("image"), updatePackage).delete(verifyJWT, deletePackage);

export default router;