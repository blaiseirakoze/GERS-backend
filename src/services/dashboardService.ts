
import model from '../database/models';
import dataTable from 'sequelize-datatable';
import { createLogs } from '../helpers/logs';
import { filter } from '../helpers/common_functions';
import { Op } from 'sequelize';

const { Request, Tender, User, Bid } = model;

/**
 * Dashboard service
 */
class DashBoardService {
    /**
     * view all
     * @returns 
     */
    public static async viewDashboard() {
        const users = await User.count();
        const tenders = await Tender.count();
        const requests = await Request.count();
        const bids = await Bid.count();
        const dashboard = {
            users, requests, tenders, bids
        }
        return { status: 200, message: 'dashboard', data: dashboard }
    }

}

export default DashBoardService;