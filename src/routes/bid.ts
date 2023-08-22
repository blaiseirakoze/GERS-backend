import express from "express";
import BidController from "../controllers/bidController";
import validator from "../middlewares/validator";
import { createRoleSchema } from "../validation";
import { multerUploads } from "../middlewares/multer";

const router = express.Router();

router.post("/create", multerUploads, BidController.create);
router.get("/view/:id", BidController.viewOne);
router.get("/view-by-tender/:tenderId", BidController.viewAll);
router.put("/update/:id", BidController.update);
router.delete("/delete/:id", BidController.delete);
router.get("/datatable", BidController.datatable);
router.get("/search", BidController.search);
router.put("/change-status", BidController.changeStatus)

export default router;