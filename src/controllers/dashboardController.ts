import DashboardService from "../services/dashboardService";
import { Request, Response } from "express";
import { sequelize } from "../database/models";

/**
 * Dashboard controller
 */
class DashboardController {
    /**
     * view dashboard
     * @param req 
     * @param res 
     * @returns 
     */
    static async viewDashboard(req: Request, res: Response) {
        try {
            const response: any = await DashboardService.viewDashboard();
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default DashboardController;