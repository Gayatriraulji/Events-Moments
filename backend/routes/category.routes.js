import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/").post(verifyJWT, upload.single("image"), createCategory);
router.route("/:id").get(getCategoryById);
router.route("/:id").put(verifyJWT, upload.single("image"), updateCategory).delete(verifyJWT, deleteCategory);

export default router;