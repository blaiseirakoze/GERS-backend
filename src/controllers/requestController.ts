import RequestService from "../services/requestService";
import { Request, Response } from "express";
import { sequelize } from "../database/models";
import stream from "stream";
import { isEmptyObject } from "../helpers/common_functions";

/**
 * service request controller
 */
class ServiceRequestController {
  /**
   * create
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
      const response: any = await RequestService.create(
        information,
        loggedInUserId,
        transaction
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      await transaction?.rollback();
      return res.status(500).json({ message: "Internal server error" });
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
      const response: any = await RequestService.viewOne(id);
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
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
      const response: any = await RequestService.viewAll();
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * update
   * @param req
   * @param res
   * @returns
   */
  static async update(req: any, res: Response) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const id = req.params.id;
      const information = req.body;
      const loggedInUserId = req?.user?.userId;
      const response: any = await RequestService.update(
        id,
        information,
        loggedInUserId,
        transaction
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      await transaction?.rollback();
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * change Status
   * @param req
   * @param res
   * @returns
   */
  static async changeStatus(req: any, res: Response) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const id = req.params.id;
      const information = req.body;
      const loggedInUserId = req?.user?.userId;
      const response: any = await RequestService.changeStatus(
        id,
        information,
        loggedInUserId,
        transaction
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      await transaction?.rollback();
      return res.status(500).json({ message: "Internal server error" });
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
      const response: any = await RequestService.delete(
        id,
        loggedInUserId
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * datatable
   * @param req
   * @param res
   * @returns
   */
  static async datatable(req: any, res: Response) {
    try {
      const query = req.query;
      let condition = { requester: req.user.userId };

      if (!isEmptyObject(query.info)) {
        const info = JSON.parse(query.info);
        condition = { ...info, requester: req.user.userId };
      }
      const response: any = await RequestService.datatable(
        query,
        condition
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * datatable
   * @param req
   * @param res
   * @returns
   */
  static async incomingRequestDatatable(req: any, res: Response) {
    try {
      const query = req.query;
      let condition = { approver: req.user.userId };

      if (!isEmptyObject(query.info)) {
        const info = JSON.parse(query.info);
        condition = { ...info, approver: req.user.userId };
      }
      const response: any =
        await RequestService.incomingRequestDatatable(
          query,
          condition
        );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
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
      const response: any = await RequestService.search(
        req.query,
        loggedInUserId
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * export request report
   * @param req
   * @param res
   * @returns
   */
  static async exportRequestReport(req: any, res: Response) {
    try {
      const exportPdf = await RequestService.exportRequestReport(
        req.params.id
      );

      if (!exportPdf.buffer) {
        return res.status(500).send("Server Error !");
      }
      const readStream = new stream.PassThrough();
      readStream.end(exportPdf.buffer);

      res.set("Content-disposition", "inline; filename=" + "task report");
      res.set("Content-Type", exportPdf.contentType);

      readStream.pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * dashboardData
   * @param req
   * @param res
   * @returns
   */
  static async dashboardData(req: any, res: Response) {
    try {
      const response: any = await RequestService.dashboardData(
        req.user.userId
      );
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * dashboardAllData
   * @param req
   * @param res
   * @returns
   */
  static async dashboardAllData(req: any, res: Response) {
    try {
      const response: any = await RequestService.dashboardAllData( req.user.userId);
      if (response) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default ServiceRequestController;
