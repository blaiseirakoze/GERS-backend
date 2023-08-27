import UserService from "../services/userService";
import { Request, Response } from "express";

/**
 * User controller
 */
class UserController {
    /**
     * signiin
     * @param req 
     * @param res 
     * @returns 
     */
    static async signIn(req: Request, res: Response) {
        try {
            const information = req.body;
            const response: any = await UserService.siginIn(information);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {                                                            
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
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
            const response: any = await UserService.create(information, loggedInUserId);
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
            const response: any = await UserService.viewOne(id);
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
            const role = req.query.role;
            const response: any = await UserService.viewAll(role);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            console.log("erreo ------------------------- ", error);
            
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
            const response: any = await UserService.update(id, information, loggedInUserId);
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
            const response: any = await UserService.delete(id, loggedInUserId);
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
            const id = req.params.id;
            const loggedInUserId = req?.user?.userId;
            const response: any = await UserService.changeStatus(id, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * change password
     * @param req 
     * @param res 
     * @returns 
     */
    static async changePassword(req: any, res: Response) {
        try {
            const id = req.params.id;
            const information = req.body;
            const loggedInUserId = req?.user?.userId;
            const response: any = await UserService.changePassword(id, information, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
    * reset password
    * @param req 
    * @param res 
    * @returns 
    */
    static async resetPasswordGet(req: any, res: Response) {
        try {
            const email = req.query.email;
            const loggedInUserId = req?.user?.userId;
            const response: any = await UserService.resetPasswordGet(email, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
    * reset password
    * @param req 
    * @param res 
    * @returns 
    */
    static async resetPasswordPost(req: any, res: Response) {
        try {
            const accessToken = req && req?.headers['authorization'];
            const response: any = await UserService.resetPasswordPost(req.body, accessToken);
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
            const response: any = await UserService.datatable(query);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            console.log("error ----------------------- ", error);
            
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
            const response: any = await UserService.search(req.query, loggedInUserId);
            if (response) {
                return res.status(response.status).json(response);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default UserController;