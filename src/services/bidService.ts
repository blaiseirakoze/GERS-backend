
import model from '../database/models';
import dataTable from 'sequelize-datatable';
import { createLogs } from '../helpers/logs';
import { filter } from '../helpers/common_functions';
import { Op } from 'sequelize';

const { Request, Bid } = model;

/**
 * bid service
 */
class BidService {
    /**
     * create
     * @param information 
     * @returns 
     */
    public static async create(information: any, transaction: any) {
        const { bidDocuments, ...bidInfo } = information;
        // check bid exist
        const bidFound = await Bid.findOne({
            where: { [Op.and]: [{ bidder: bidInfo.bidder }, { tenderId: bidInfo.tenderId }] }
        });
        if (bidFound) {
            await transaction.rollback();
            return { status: 409, message: "you have already applied to this bid" };
        }
        let documents = [];
        if (bidDocuments !== undefined) {
            for (const doc of bidDocuments) {
                documents.push(doc.filename);
            }
        }
        const bid = await Bid.create({ ...bidInfo, documents: documents.toString() }, { transaction });
        await transaction.commit();
        // return
        return {
            status: 201,
            message: "create",
            data: bid
        }
    }
    /**
     * view by id
     * @param id 
     */
    public static async viewOne(id: string) {
        const bid = await Bid.findOne({ where: { id } });
        if (!bid) {
            return { status: 404, message: "bid not found" };
        }
        return { status: 200, message: 'bid', data: bid }
    }

    /**
     * view all
     * @returns 
     */
    public static async viewAll() {
        const bids = await Bid.findAll();
        return { status: 200, message: 'bids', data: bids }
    }
    /**
     * update
     * @param information 
     * @returns 
     */
    public static async update(id: string, information: any, userId: string) {
        // check role exist
        const bid = await Bid.findOne({ where: { id } });
        if (!bid) {
            return { status: 404, message: "bid not found" };
        }
        const updatedbid = await bid.update(information);
        // return
        if (updatedbid) {
            // create logs
            await createLogs({ action: "update", description: "update bid", module: "bid", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedbid,
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
        const bid = await Bid.findOne({ where: { id } });
        if (!bid) {
            return { status: 404, message: "bid not found" };
        }
        const deletedbid = await bid.destroy({ where: { id } });
        if (deletedbid) {
            // create logs
            await createLogs({ action: "delete", description: "delete bid", module: "bid", createdBy: userId });
            return {
                status: 204,
                message: "Success",
                data: deletedbid,
            };
        }
    }
    /**
     * datatable
     * @returns 
     */
    public static async datatable(query: any) {
        const bids = await dataTable(Bid, query, {
            order: [['createdAt', 'DESC']],
        });
        return { status: 200, message: 'datatable', data: bids }
    }
    /**
     * search
     * @param query 
     * @param userId 
     * @returns 
     */
    public static async search(query: any, userId: string) {
        const data = await filter(Bid, Op, query);
        if (!data) {
            return { status: 404, message: "not found" };
        }
        return { status: 200, message: 'roles', data }
    }
}

export default BidService;