import express from "express";
import RoleController from "../controllers/roleController";
import validator from "../middlewares/validator";
import { createRoleSchema } from "../validation";

const router = express.Router();

router.post("/create", validator(createRoleSchema), RoleController.create);
router.get("/view/:id", RoleController.viewOne);
router.get("/view", RoleController.viewAll);
router.put("/update/:id", RoleController.update);
router.delete("/delete/:id", RoleController.delete);
router.get("/datatable", RoleController.datatable);
router.get("/search", RoleController.search);

export default router;