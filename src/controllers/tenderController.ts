import TenderService from "../services/tenderService";
import { Request, Response } from "express";
import { sequelize } from "../database/models";

/**
 * Tender controller
 */
class TenderController {
    /**
     * create tender
     * @param req 
     * @param res 
     * @returns 
     */
    static async create(req: any, res: Response) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const information = req.body;
            const loggedInUserId = req?.user?.userId;
            const response: any = await TenderService.create(information, loggedInUserId, transaction);
            if (response) {
                await transaction.commit();
                return res.status(response.status).json(response);
            }
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * view one
     * @param req 
     * @param res 
     * @returns 
     */
    static async viewOne(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const response: any = await TenderService.viewOne(id);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * view all
     * @param req 
     * @param res 
     * @returns 
     */
    static async viewAll(req: Request, res: Response) {
        try {
            const response: any = await TenderService.viewAll();
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * update
     * @param req 
     * @param res 
     * @returns 
     */
    static async update(req: any, res: Response) {
        try {
            const id = req.params.id;
            const information = req.body;
            const loggedInUserId = req?.user?.userId;
            const response: any = await TenderService.update(id, information, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * delete
     * @param req 
     * @param res 
     * @returns 
     */
    static async delete(req: any, res: Response) {
        try {
            const id = req.params.id;
            const loggedInUserId = req?.user?.userId;
            const response: any = await TenderService.delete(id, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * datatable
     * @param req 
     * @param res 
     * @returns 
     */
    static async datatable(req: Request, res: Response) {
        try {
            const query = req.query;
            const response: any = await TenderService.datatable(query);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
   * search
   * @param req 
   * @param res 
   * @returns 
   */
    static async search(req: any, res: Response) {
        try {
            const loggedInUserId = req?.user?.userId;
            const response: any = await TenderService.search(req.query, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default TenderController;