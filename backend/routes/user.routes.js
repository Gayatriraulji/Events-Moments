import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getAllUsers, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/users").get(verifyJWT, getAllUsers);
router.route("/users/:id").put(verifyJWT, updateUser).delete(verifyJWT, deleteUser);

export default router;