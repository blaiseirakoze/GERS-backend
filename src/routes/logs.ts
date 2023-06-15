import express from "express";
import LogsController from "../controllers/logsController";

const router = express.Router();

router.get("/view/:id", LogsController.viewOne);
router.get("/view", LogsController.viewAll);
router.delete("/delete/:id", LogsController.delete);
router.get("/datatable", LogsController.datatable);
router.get("/search", LogsController.search);

export default router;