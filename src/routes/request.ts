import express from "express";
import RequestController from "../controllers/requestController";

const router = express.Router();

router.post("/create", RequestController.create);
router.get("/view/:id", RequestController.viewOne);
router.get("/view", RequestController.viewAll);
router.put("/update/:id", RequestController.update);
router.put("/change-status/:id", RequestController.changeStatus);
router.delete("/delete/:id", RequestController.delete);
router.get("/datatable", RequestController.datatable);
router.get("/datatable/incoming", RequestController.incomingRequestDatatable);
router.get("/search", RequestController.search);
router.get("/dashboard", RequestController.dashboardData);
router.get("/all-dashboard", RequestController.dashboardAllData);

export default router;