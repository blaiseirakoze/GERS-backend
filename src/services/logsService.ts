
import model from '../database/models';
import dataTable from 'sequelize-datatable';
import { createLogs } from '../helpers/logs';
import { filter } from '../helpers/common_functions';
import { Op } from 'sequelize';

const { Logs, User } = model;

/**
 * Logs service
 */
class LogsService {
    /**
     * view by id
     * @param id 
     */
    public static async viewOne(id: string) {
        const logs = await Logs.findOne({ where: { id } });
        if (!logs) {
            return { status: 404, message: "Logs not found" };
        }
        return { status: 200, message: 'logs', data: logs }
    }
    /**
     * view all
     * @returns 
     */
    public static async viewAll() {
        const logs = await Logs.findAll();
        return { status: 200, message: 'logs', data: logs }
    }
    /**
     * delete
     * @param information 
     * @returns 
     */
    public static async delete(id: string, userId: string) {
        // check logs exist
        const logs = await Logs.findOne({ where: { id } });
        if (!logs) {
            return { status: 404, message: "Logs not found" };
        }
        const deletedLogs = await Logs.destroy({ where: { id } });
        if (deletedLogs) {
            // create logs
            await createLogs({ action: "delete", description: "delete logs", module: "logs", createdBy: userId });
            return {
                status: 204,
                message: "Success",
                data: deletedLogs,
            };
        }
    }
    /**
     * datatable
     * @returns 
     */
    public static async datatable(query: any) {
        const logs = await dataTable(Logs, query, {
            order: [['createdAt', 'DESC']],
        });
        return { status: 200, message: 'datatable', data: logs }
    }
    /**
     * search
     * @param query 
     * @param userId 
     * @returns 
     */
    public static async search(query: any, userId: string) {
        const includes = { model: User }
        const data = await filter(Logs, Op, query, includes);
        if (!data) {
            return { status: 404, message: "not found" };
        }
        return { status: 200, message: 'logs', data }
    }
}

export default LogsService;