
import model from '../database/models';
import dataTable from 'sequelize-datatable';
import { createLogs } from '../helpers/logs';
import { filter } from '../helpers/common_functions';
import { Op } from 'sequelize';

const { Role } = model;

/**
 * role service
 */
class RoleService {
    /**
     * create
     * @param information 
     * @returns 
     */
    public static async create(information: any, userId: string) {
        // check role exist
        const roleFound = await Role.findOne({ where: { name: information.name } });
        if (roleFound) {
            return { status: 409, message: "Role already exist" };
        }
        const role = await Role.create(information);
        // return
        if (role) {
            // create logs
            await createLogs({ action: "create", description: "create role", module: "role", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: role,
            };
        }
    }
    /**
     * view by id
     * @param id 
     */
    public static async viewOne(id: string) {
        const role = await Role.findOne({ where: { id } });
        if (!role) {
            return { status: 404, message: "Role not found" };
        }
        return { status: 200, message: 'role', data: role }
    }
    
    /**
     * view all
     * @returns 
     */
    public static async viewAll() {
        const roles = await Role.findAll();
        return { status: 200, message: 'roles', data: roles }
    }
    /**
     * update
     * @param information 
     * @returns 
     */
    public static async update(id: string, information: any, userId: string) {
        // check role exist
        const role = await Role.findOne({ where: { id } });
        if (!role) {
            return { status: 404, message: "Role not found" };
        }
        const updatedRole = await role.update(information);
        // return
        if (updatedRole) {
            // create logs
            await createLogs({ action: "update", description: "update role", module: "role", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedRole,
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
        const role = await Role.findOne({ where: { id } });
        if (!role) {
            return { status: 404, message: "Role not found" };
        }
        const deletedRole = await role.destroy({ where: { id } });
        if (deletedRole) {
            // create logs
            await createLogs({ action: "delete", description: "delete role", module: "role", createdBy: userId });
            return {
                status: 204,
                message: "Success",
                data: deletedRole,
            };
        }
    }
    /**
     * datatable
     * @returns 
     */
    public static async datatable(query: any) {
        const roles = await dataTable(Role, query, {
            order: [['createdAt', 'DESC']],
        });
        return { status: 200, message: 'datatable', data: roles }
    }
    /**
     * search
     * @param query 
     * @param userId 
     * @returns 
     */
    public static async search(query: any, userId: string) {
        const data = await filter(Role, Op, query);
        if (!data) {
            return { status: 404, message: "not found" };
        }
        return { status: 200, message: 'roles', data }
    }
}

export default RoleService;