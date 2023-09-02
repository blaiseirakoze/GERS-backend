import express from "express";
import DashboardController from "../controllers/dashboardController";

const router = express.Router();

router.get("/view-dashboard", DashboardController.viewDashboard);

export default router;