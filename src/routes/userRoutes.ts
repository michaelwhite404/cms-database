import { Router } from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

router.route("/").get(userController.getAllUsers);
router
	.route("/:user_id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

export default router;
