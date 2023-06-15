import express from "express";
import UserController from "../controllers/userController";
import validator from "../middlewares/validator";
import { createUserSchema, changePasswordSchema } from "../validation";

const router = express.Router();

router.post("/create", validator(createUserSchema), UserController.create);
router.get("/view/:id", UserController.viewOne);
router.get("/view", UserController.viewAll);
router.put("/update/:id", UserController.update);
router.put("/change-status/:id", UserController.changeStatus);
router.put("/change-password/:id", validator(changePasswordSchema), UserController.changePassword);
router.delete("/delete/:id", UserController.delete);
router.get("/datatable", UserController.datatable);
router.get("/search", UserController.search);

export default router;