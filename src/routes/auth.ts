import express from "express";
import UserController from "../controllers/userController";
import validator from "../middlewares/validator";
import { siginInSchema } from "../validation";

const router = express.Router();

router.post("/signin", UserController.signIn);
router.get("/reset-password", UserController.resetPasswordGet);
router.post("/reset-password", UserController.resetPasswordPost);

export default router;