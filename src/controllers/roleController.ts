import RoleService from "../services/roleService";
import { Request, Response } from "express";

/**
 * Role controller
 */
class RoleController {
    /**
     * create user
     * @param req 
     * @param res 
     * @returns 
     */
    static async create(req: any, res: Response) {
        try {
            const information = req.body;
            const loggedInUserId = req?.user?.userId;
            const response: any = await RoleService.create(information, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
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
            const response: any = await RoleService.viewOne(id);
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
            const response: any = await RoleService.viewAll();
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
            const response: any = await RoleService.update(id, information, loggedInUserId);
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
            const response: any = await RoleService.delete(id, loggedInUserId);
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
            const response: any = await RoleService.datatable(query);
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
            const response: any = await RoleService.search(req.query, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default RoleController;