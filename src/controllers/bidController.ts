import BidService from "../services/bidService";
import { Request, Response } from "express";
import { sequelize } from "../database/models";

/**
 * Bid controller
 */
class BidController {
    /**
     * create bid
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
            const bidDocuments = req.files.bidDocuments;
            const response: any = await BidService.create({ ...information, bidder: loggedInUserId, bidDocuments }, transaction);
            if (response) {
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
            const response: any = await BidService.viewOne(id);
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
    static async viewAll(req: any, res: Response) {
        try {
            const tenderId = req.params.tenderId;
            const loggedInUser = req?.user;
            const response: any = await BidService.viewAll(tenderId, loggedInUser);
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
            const response: any = await BidService.update(id, information, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * change status
     * @param req 
     * @param res 
     * @returns 
     */
    static async changeStatus(req: any, res: Response) {
        try {
            const { tenderId, id, bidder } = req.query;
            const response = await BidService.changeStatus({ tenderId, id, bidder });
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {            
            return res.status(500).json({ message: "internal server error" });
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
            const response: any = await BidService.delete(id, loggedInUserId);
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
            const response: any = await BidService.datatable(query);
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
            const response: any = await BidService.search(req.query, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default BidController;