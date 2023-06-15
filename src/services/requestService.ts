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
    userId: string,
    transaction: any
  ) {
    const approvedBySecretary = [
      "lumpsum certificate",
      "salary certificate",
      "pay slip",
      "service certificate",
      "employment certificate",
      "anticipative retirement",
      "non anticipative retirement",
    ]; // request approved by secretary general
    const approvedByHr = ["furniture form", "refraichisment form"]; // request approved by HR and sent to logistic

    // check approver
    let role: any;
    let message;
    if (inArray(approvedBySecretary, information?.requestType)) {
      role = await Role.findOne({ where: { name: "secretary" } }); //get role details of secretary general
      message = "Cannot find Secretary General,Please contact Administrator.";
    } else {
      role = await Role.findOne({ where: { name: "hr" } }); //get role details of hr
      message = "Cannot Human Resource Manager,Please contact Administrator.";
    }
    const approver = await User.findOne({ where: { roleId: role.id } }); //get user with role

    if (!approver) {
      await transaction.rollback();
      // return
      return {
        status: 404,
        message,
      };
    }
    const serviceRequest = await Request.create(
      { ...information, approver: approver.id },
      {
        transaction,
      }
    );
    if (serviceRequest) {
      const request = await RequestProcess.create(
        { serviceRequestId: Request.id, userId },
        { transaction }
      );
      if (request) {
        // create logs
        await createLogs(
          {
            action: "create",
            description: "create service request",
            module: "service request",
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
      //   { model: RequestProcess },
      // ],
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
  public static async viewAll() {
    const serviceRequests = await Request.findAll({
      include: [],
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
    userId: string,
    transaction: any
  ) {
    // check service request exist
    const serviceRequest = await Request.findOne({ where: { id } });
    if (!serviceRequest) {
      await transaction.rollback();
      return { status: 404, message: "service request not found" };
    }
    const updatedServiceRequest = await Request.update(
      { ...information },
      { transaction }
    );
    // return
    if (updatedServiceRequest) {
      const updatedRequest = await RequestProcess.create(
        {
          serviceRequestId: id,
          status: information.status ? information.status : "pending",
          userId,
        },
        { transaction }
      );
      if (updatedRequest) {
        // create logs
        await createLogs(
          {
            action: "update",
            description: "update service request",
            module: "service request",
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
  public static async changeStatus(
    id: string,
    information: any,
    userId: string,
    transaction: any
  ) {
    const { status, comment } = information;
    // check service request exist
    const serviceRequest = await Request.findOne({
      where: { id },
      //   include: { model: RequestProcess },
    });
    if (!serviceRequest) {
      await transaction.rollback();
      return { status: 404, message: "service request not found" };
    }
    // update service request status
    const updatedServiceRequest = await Request.update(
      { status },
      { transaction }
    );
    if (updatedServiceRequest) {
      // create request process
      const updatedRequest = await RequestProcess.create(
        { serviceRequestId: id, status, comment, userId },
        { transaction }
      );
      if (updatedRequest) {
        // create logs
        await createLogs(
          {
            action: "change status",
            description: "change status service request",
            module: "service request",
            createdBy: userId,
          },
          transaction
        );
        await transaction.commit();
        // return
        return {
          status: 201,
          message: "Success",
          data: updatedRequest,
        };
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
      { model: User, as: "approvedBy" },
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
