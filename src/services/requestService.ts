import model from "../database/models";
import dataTable from "sequelize-datatable";
import { createLogs } from "../helpers/logs";
import { filter, inArray } from "../helpers/common_functions";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import pdf from "html-pdf";
import Handlebars from "handlebars";
import moment from "moment";
import Sequelize from 'sequelize';

const { Request, User, RequestProcess, Role } = model;

/**
 * request service
 */
class ServiceRequestService {
  /**
   * creates
   * @param information
   * @returns
   */
  public static async create(
    information: any,
    files: any,
    userId: string,
    transaction: any
  ) {
    let documents = [];
    if (files.documents !== undefined) {
      for (const doc of files.documents) {
        documents.push(doc.filename);
      }
    }
    const request = await Request.create(
      { ...information, documents: documents.toString(), requester: userId },
      {
        transaction,
      }
    );
    if (request) {
      const requestProcess = await RequestProcess.create(
        { requestId: request.id, userId },
        { transaction }
      );
      if (requestProcess) {
        // create logs
        await createLogs(
          {
            action: "create",
            description: "create request",
            module: "request",
            createdBy: userId,
          },
          transaction
        );
        await transaction.commit();
        // return
        return {
          status: 201,
          message: "Success",
          data: Request,
        };
      }
    }
  }
  /**
   * view by id
   * @param id
   */
  public static async viewOne(id: string) {
    const serviceRequest = await Request.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "requestedBy",
        },
        // {
        //   model: User,
        //   as: "approvedBy",
        // },
        { model: RequestProcess, as: "requestProcess" },
      ],
    });
    if (!serviceRequest) {
      return { status: 404, message: "service request not found" };
    }
    return { status: 200, message: "service request", data: serviceRequest };
  }
  /**
   * view all
   * @returns
   */
  public static async viewAll(loggedInUser: any) {
    const { role, userId } = loggedInUser;
    const where = {};
    if (role != "risa") {
      where["requester"] = userId;
    }
    const serviceRequests = await Request.findAll({
      order: [['requestProcess', 'createdAt', 'ASC']],
      where: where,
      include: [
        { model: User, as: "requestedBy", include: { model: Role, as: "role" } },
        {
          model: RequestProcess,
          as: "requestProcess",
          include: { model: User, as: "createdBy" },
        },
      ],
    });
    return { status: 200, message: "service requests", data: serviceRequests };
  }
  /**
   * update
   * @param information
   * @returns
   */
  public static async update(
    id: string,
    information: any,
    files: any,
    userId: string,
    transaction: any
  ) {
    // check request exist
    const request = await Request.findOne({ where: { id } });
    if (!request) {
      await transaction.rollback();
      return { status: 404, message: "request not found" };
    }
    // handle docs
    let documents = [];
    if (files.documents !== undefined) {
      for (const doc of files.documents) {
        documents.push(doc.filename);
      }
    }
    // update
    const updatedRequest = await request.update(
      { ...information, status: "pending", documents: documents ? documents.toString() : information?.documents },
      { transaction }
    );

    if (updatedRequest) {
      const updatedRequestProcess = await RequestProcess.create(
        {
          requestId: id,
          status: "pending",
          userId,
        },
        { transaction }
      );
      if (updatedRequestProcess) {
        // create logs
        await createLogs(
          {
            action: "update",
            description: "update request",
            module: "request",
            createdBy: userId,
          },
          transaction
        );
        await transaction.commit();

        return {
          status: 201,
          message: "Success",
          data: updatedRequest,
        };
      }
    }
  }
  /**
   * change Status
   * @param information
   * @returns
   */
  public static async changeStatus(id: string, information: any, userId: string, transaction: any) {
    const { status, comment } = information;
    // check  request exist
    const request = await Request.findOne({
      where: { id },
      //   include: { model: RequestProcess },
    });
    if (!request) {
      await transaction.rollback();
      return { status: 404, message: "request not found" };
    }
    // update  request status
    const updatedRequest = await request.update({ status }, { transaction });
    if (updatedRequest) {
      // create request process
      const createRequestProcess = await RequestProcess.create(
        { requestId: id, status, comment, userId },
        { transaction }
      );
      if (createRequestProcess) {
        // create logs
        await createLogs(
          { action: "change status", description: "change status request", module: "request", createdBy: userId },
          transaction);
        await transaction.commit();
        // return
        return { status: 201, message: "Success", data: updatedRequest };
      }
    }
  }
  /**
   * delete
   * @param information
   * @returns
   */
  public static async delete(id: string, userId: string) {
    // check service request exist
    const serviceRequest = await Request.findOne({ where: { id } });
    if (!serviceRequest) {
      return { status: 404, message: "service request not found" };
    }
    const deletedRequest = await Request.destroy({
      where: { id },
    });
    if (deletedRequest) {
      // create logs
      await createLogs({
        action: "delete",
        description: "delete service request",
        module: "service request",
        createdBy: userId,
      });
      return {
        status: 204,
        message: "Success",
        data: deletedRequest,
      };
    }
  }
  /**
   * datatable
   * @returns
   */
  public static async datatable(query: any, condition: any) {

    const serviceRequests = await dataTable(Request, query, {
      where: condition,
      order: [["createdAt", "DESC"]],
      include: [
        // { model: User, as: "requestedBy", include: { model: Employee } },
        { model: User, as: "approvedBy" },
      ],
    });
    return { status: 200, message: "datatable", data: serviceRequests };
  }
  /**
   * datatable
   * @returns
   */
  public static async incomingRequestDatatable(query: any, condition: any) {
    const serviceRequests = await dataTable(Request, query, {
      where: condition,
      order: [["createdAt", "DESC"]],
      include: [
        // { model: User, as: "requestedBy", include: { model: Employee } },
        { model: User, as: "approvedBy" },
      ],
    });
    return { status: 200, message: "datatable", data: serviceRequests };
  }
  /**
   * search
   * @param query
   * @param userId
   * @returns
   */
  public static async search(query: any, userId: string) {
    const includes = [
      { model: User, as: "requestedBy" },
    ];
    const data = await filter(Request, Op, query, includes);
    if (!data) {
      return { status: 404, message: "not found" };
    }
    return { status: 200, message: "service requests", data };
  }

  /**
   *
   * @param id
   * @returns
   */
  static async exportRequestReport(id: any) {
    const request = await Request.findOne({
      where: { id },
      // include: [
      //   {
      //     model: User,
      //     as: "requestedBy",
      //     include: { model: Employee, include: { model: Position } },
      //   },
      //   {
      //     model: User,
      //     as: "approvedBy",
      //     include: { model: Employee, include: { model: Position } },
      //   },
      // ],
    });
    const pictureHtml = `<img src="https://seeklogo.com/images/C/coat-of-arms-of-rwanda-logo-BB21249B2A-seeklogo.com.png" alt="Alt" style="width:150px;">`;
    const pictureHtml2 = `<img src="https://pbs.twimg.com/profile_images/1526491426720210944/p-n1N8wy_400x400.jpg" alt="Alt" style="width:150px;">`;

    if (request) {
      const jsonPath = path.join(__dirname, "..", "template", "request.html");

      const source = fs.readFileSync(jsonPath, "utf8");

      const template = Handlebars.compile(source);

      const html = template({
        department: request?.requestedBy?.Department?.name,
        position: request?.requestedBy?.Position?.name,
        salary: request?.salary,
        reason: request?.reason,
        requestType: request?.requestType,
        firstName: request?.requestedBy?.firstName,
        lastName: request?.requestedBy?.lastName,
        approverFirstName: request?.approvedBy?.firstName,
        approverLastName: request?.approvedBy?.lastName,
        approverPosition: request?.approvedBy?.Position?.name,
        newDate: moment(new Date()).format("L"),
        pictureHtml,
        pictureHtml2,
      });
      const options = {
        format: "Letter",
        header: {
          height: "15mm",
        },
        footer: {
          height: "15mm",
        },
      };
      const buffer = await new Promise((resolve) => {
        pdf.create(html, options).toBuffer(function (err, buffer) {
          if (err) {
            resolve(null);
          } else {
            resolve(buffer);
          }
        });
      });

      return {
        buffer,
        fileName: "mission",
        contentType: "application/pdf",
      };
    }
  }
  static async dashboardData(requester: any) {
    const statusInfo = await Request.findAll({
      where: { requester },
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "request"],
      ],
      group: ["status"],
    });
    return { status: 200, message: "dashboardData", data: statusInfo };

  }
  static async dashboardAllData(approver: any) {
    const statusInfo = await Request.findAll({
      where: { approver },
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "request"],
      ],
      group: ["status"],
    });
    return { status: 200, message: "dashboardData", data: statusInfo };

  }
}

export default ServiceRequestService;
