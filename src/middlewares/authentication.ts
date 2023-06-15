import TokenManager from "../helpers/tokenHandler";
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response } from "express";
import model from '../database/models';

const { User, Permission } = model;

class UserAuthManager {
  /**
   * Authentication manager
   * @param req
   * @param res
   * @param next
   * @returns
   */
  static async authenticate(req: Request, res: Response, next) {
    const accessToken = req && req?.headers['authorization'];
    try {
      // check if token provided
      if (!accessToken) {
        return res.status(403).send({
          message: "No token provided!"
        });
      }
      // check if token is valid
      const decodedToken: any = await TokenManager.verify(accessToken && accessToken)
      if (!decodedToken) {
        return res.status(401).json({
          message: "Unauthorized!"
        });
      }
      const user: any = await User.findOne({ where: { id: decodedToken.userId } });
      if (!user) {
        return res.status(401).json({
          message: "Unauthorized!"
        });
      }
      // loggedin user
      req['user'] = {
        userId: decodedToken.userId,
        employeeId: user.employeeId,
        email: user.email,
        role: decodedToken?.userRole
      };
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
  }
  /**
  * Permissions middleware
  * @param req
  * @param res
  * @param next
  */
  static permission = (mod?) => {
    return async (req, res, next) => {
      try {
        const module = mod ? mod : req.baseUrl.split("/")[2];
        const method = req.method;
        let permitted;
        const { userId } = req.user;
        const permission = await Permission.findOne({
          where: { userId, name: module }
        })
        switch (method) {
          case "POST":
            permitted = permission?.create
            break;
          case "PUT":
            permitted = permission?.update
            break;
          case "GET":
            permitted = permission?.read
            break;
          case "DELETE":
            permitted = permission?.delete
            break;
          default:
            permitted = false;
        }

        // return if not permitted
        if (!permitted)
          return res.status(403).json({
            message: `you are not allowed to ${method} ${module}`,
          });
        next();
      } catch (error) {
        return res.status(500).json({
          message: 'Internal server Error',
        });
      }
    }
  }
}
export default UserAuthManager

