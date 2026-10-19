import { Router } from "express";
import { uploadGalleryImages, getAllGalleryImages, deleteGalleryImage } from "../controllers/gallery.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(getAllGalleryImages);
router.route("/").post(verifyJWT, upload.array("images", 10), uploadGalleryImages);
router.route("/:id").delete(verifyJWT, deleteGalleryImage);

export default router;