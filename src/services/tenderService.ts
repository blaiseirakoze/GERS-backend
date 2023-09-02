
import model from '../database/models';
import dataTable from 'sequelize-datatable';
import { createLogs } from '../helpers/logs';
import { filter } from '../helpers/common_functions';
import { Op } from 'sequelize';

const { Tender, TenderDocument, Request, User, Role } = model;

/**
 * tender service
 */
class TenderService {
    /**
     * create
     * @param information 
     * @returns 
     */
    public static async create(information: any, userId: string, transaction: any) {
        const { documents, ...tenderInfo } = information;
        // check tender exist
        const tenderFound = await Tender.findOne({ where: { name: tenderInfo.name } });
        if (tenderFound) {
            await transaction.rollback();
            return { status: 409, message: "tender already exist" };
        }
        const tender = await Tender.create(tenderInfo, { transaction });
        // return
        if (tender) {
            // change request status
            const request = await Request.findOne({ where: { id: tenderInfo.requestId } });
            await request.update({ tenderPublished: true }, { transaction });
            // create tender required documents
            for (const doc of documents) {
                const { id, ...newDoc } = doc;
                await TenderDocument.create({ ...newDoc, tenderId: tender.id }, { transaction });
            }
            // create logs
            await createLogs({ action: "create", description: "create tender", module: "tender", createdBy: userId }, transaction);
            return {
                status: 201,
                message: "Success",
                data: tender,
            };
        }
    }
    /**
     * view by id
     * @param id 
     */
    public static async viewOne(id: string) {
        const tender = await Tender.findOne({
            where: { id },
            include: [{ model: TenderDocument, as: "tenderDocuments" },
            { model: User, as: "supplier" },
            {
                model: Request, as: "request", include:
                    { model: User, as: "requestedBy", include: { model: Role, as: "role" } },
            }]
        });
        if (!tender) {
            return { status: 404, message: "tender not found" };
        }
        return { status: 200, message: 'tender', data: tender }
    }

    /**
     * view all
     * @returns 
     */
    public static async viewAll() {
        const tenders = await Tender.findAll({
            include: [{ model: TenderDocument, as: "tenderDocuments" },
            { model: User, as: "supplier" },
            { model: Request, as: "request" }]
        });
        return { status: 200, message: 'tenders', data: tenders }
    }
    /**
   * datatable
   * @returns
   */
    public static async datatable(query: any) {
        const tenders = await dataTable(Tender, query, {
            include: [{ model: TenderDocument, as: "tenderDocuments" },
            { model: User, as: "supplier" },
            { model: Request, as: "request" }]
        });
        return { status: 200, message: "tenders", data: tenders };
    }
    /**
     * update
     * @param information 
     * @returns 
     */
    public static async update(id: string, information: any, userId: string) {
        // check role exist
        const tender = await Tender.findOne({ where: { id } });
        if (!tender) {
            return { status: 404, message: "tender not found" };
        }
        const updatedtender = await tender.update(information);
        // return
        if (updatedtender) {
            // create logs
            await createLogs({ action: "update", description: "update tender", module: "tender", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedtender,
            };
        }
    }
    /**
     * update
     * @param information 
     * @returns 
     */
    public static async uploadDocs(id: string, information: any, userId: string) {
        // check role exist
        const tender = await Tender.findOne({ where: { id } });
        if (!tender) {
            return { status: 404, message: "tender not found" };
        }
        const updatedtender = await tender.update(information);
        // return
        if (updatedtender) {
            // create logs
            await createLogs({ action: "upload delivery note", description: "upload delivery note tender", module: "tender", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedtender,
            };
        }
    }
    /**
     * update
     * @param information 
     * @returns 
     */
    public static async changeStatus(information: any, userId: string) {
        const { id, status } = information;
        // check role exist
        const tender = await Tender.findOne({ where: { id } });
        if (!tender) {
            return { status: 404, message: "tender not found" };
        }
        const changetenderstatus = await tender.update({ delivered: true });
        // return
        if (changetenderstatus) {
            // create logs
            await createLogs({ action: "change status", description: "change status tender", module: "tender", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: changetenderstatus,
            };
        }
    }
    /**
     * delete
     * @param information 
     * @returns 
     */
    public static async delete(id: string, userId: string) {
        // check role exist
        const tender = await Tender.findOne({ where: { id } });
        if (!tender) {
            return { status: 404, message: "tender not found" };
        }
        const deletedtender = await tender.destroy({ where: { id } });
        if (deletedtender) {
            // create logs
            await createLogs({ action: "delete", description: "delete tender", module: "tender", createdBy: userId });
            return {
                status: 204,
                message: "Success",
                data: deletedtender,
            };
        }
    }
    /**
     * search
     * @param query 
     * @param userId 
     * @returns 
     */
    public static async search(query: any, userId: string) {
        const data = await filter(Tender, Op, query);
        if (!data) {
            return { status: 404, message: "not found" };
        }
        return { status: 200, message: 'roles', data }
    }
}

export default TenderService;