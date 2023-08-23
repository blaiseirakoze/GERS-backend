import express from "express";
import TenderController from "../controllers/tenderController";
import { multerUploads } from "../middlewares/multer";

const router = express.Router();

router.post("/create", TenderController.create);
router.get("/view/:id", TenderController.viewOne);
router.get("/view", TenderController.viewAll);
router.put("/update/:id", TenderController.update);
router.delete("/delete/:id", TenderController.delete);
router.get("/datatable", TenderController.datatable);
router.get("/search", TenderController.search);
router.put("/upload-document/:id", multerUploads, TenderController.uploadDocs);
router.put("/change-status", TenderController.changeStatus);

export default router;