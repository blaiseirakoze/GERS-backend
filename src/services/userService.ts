
import model from '../database/models';
import { hashPassword, validatePassword } from '../helpers/bcrypt';
import TokenManager from '../helpers/tokenHandler';
import { Op } from 'sequelize';
import dataTable from 'sequelize-datatable';
import { createLogs } from '../helpers/logs';
import { sendEmail } from '../helpers/emailSender';
import { filter } from '../helpers/common_functions';

const { User, Role, Employee, Permission } = model;

/**
 * user service
 */
class UserService {
    /**
     * signin
     * @param information
     * @returns
     */
    public static async siginIn(information: any) {
        // check id user exist
        const user = await User.findOne({
            where: { [Op.or]: [{ email: information.username }, { username: information.username }] },
            include: [{ model: Role, as: "role" }]
        });
        if (!user) {
            return { status: 401, message: "Invalid Email or Password !" };
        }
        // validate password
        if (!information.password || !await validatePassword(information.password, user.password)) {
            return { status: 401, message: "Invalid Email or Password !" };
        }
        // generate token
        const userRole = user.role.name;
        const accessToken = await TokenManager.signIn({ userId: user.id, expiresIn: '1d', userRole, permission: user.Permissions });
        // create logs
        await createLogs({ action: "signin", description: "user signin", module: "user", createdBy: user.id });
        // return
        return {
            status: 200,
            message: "Success",
            accessToken: accessToken,
        };
    }
    /**
     * create user
     * @param information
     * @param userId
     * @returns
     */
    public static async create(information: any, userId: string) {
        // check user exist
        const userFound = await User.findOne({
            where: { [Op.or]: [{ email: information.email }, { username: information.username }] },
        });
        if (userFound) {
            return { status: 409, message: "User already exist" };
        }
        const password = await hashPassword(information.password ? information.password : "paloma123");
        const user = await User.create({ ...information, password });
        // return
        if (user) {
            // create logs
            await createLogs({ action: "create", description: "create user", module: "user", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: user,
            };
        }
    }
    /**
     * view one user by id
     * @param id
     */
    public static async viewOne(id: string) {
        const user = await User.findOne({
            where: { id },
            include: [{ model: Role, as: "role" }],

        });
        if (!user) {
            return { status: 404, message: "User not found" };
        }
        return { status: 200, message: 'user', data: user }
    }
    /**
     * view all users
     * @returns
     */
    public static async viewAll(role) {
        const where = {}
        if (role) {
            if (role === "risa") {
                const risa = await Role.findOne({ where: { name: role } });
                const admin = await Role.findOne({ where: { name: "admin" } });
                console.log();
                
                where[Op.or] = [{ roleId: risa.id }, { roleId: admin.id }];
            } else {
                const rl = await Role.findOne({ where: { name: role } });
                where['roleId'] = rl.id;
            }

        }
        console.log("where ------------------------- ", where);
        
        const users = await User.findAll({
            where,
            include: [{ model: Role, as: "role" }],
        });
        return { status: 200, message: 'users', data: users }
    }
    /**
     * update user
     * @param information
     * @returns
     */
    public static async update(id: string, information: any, userId: string) {
        // check user exist
        const user = await User.findOne({
            where: { id },
        });
        if (!user) {
            return { status: 404, message: "User not found" };
        }
        const updatedUser = await user.update(information);
        // return
        if (updatedUser) {
            // create logs
            await createLogs({ action: "update", description: "update user", module: "user", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedUser,
            };
        }
    }
    /**
     * delete user
     * @param information
     * @returns
     */
    public static async delete(id: string, userId: string) {
        // check user exist
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return { status: 404, message: "User not found" };
        }
        const deletedUser = await user.destroy({ where: { id } });
        if (deletedUser) {
            // create logs
            await createLogs({ action: "delete", description: "delete user", module: "user", createdBy: userId });
            // return
            return {
                status: 204,
                message: "Success",
                data: deletedUser,
            };
        }
    }
    /**
     * change user status (active/blocked)
     * @param id
     */
    public static async changeStatus(id: string, userId: string) {
        // check if user exist
        const user = await User.findOne({ where: { id } });
        if (!user) return { status: 404, message: "User not found" };
        // update status
        const status = user.status === "active" ? "blocked" : "active";
        const updatedUser = await user.update({ ...user, status });
        // return
        if (updatedUser) {
            // create logs
            await createLogs({ action: "change status", description: "change user status", module: "user", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedUser,
            };
        }
    }
    /**
    * change user password
    * @param information
    */
    public static async changePassword(id: string, information: any, userId: string) {
        // check if user exist
        const user = await User.findOne({ where: { id } });
        if (!user) return { status: 404, message: "User not found" };
        // validate password
        if (!information.currentPassword || !await validatePassword(information.currentPassword, user.password)) {
            return { status: 400, message: "Current password is not correct" };
        }
        // update password
        const password = await hashPassword(information.newPassword);
        const updatedUser = await user.update({ ...user, password });
        // return
        if (updatedUser) {
            // create logs
            await createLogs({ action: "change password", description: "change user password", module: "user", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedUser,
            };
        }
    }
    /**
    * reset user password
    * @param information
    */
    public static async resetPasswordGet(email: any, userId: string) {
        // check if user exist
        const user = await User.findOne({
            where: { email },
            include: [{ model: Employee }, { model: Role }]
        });
        if (!user) return { status: 404, message: "User not found" };
        // generate token
        const accessToken = await TokenManager.signIn({ userId: user.id, expiresIn: '1d', userRole: user?.Role?.name });
        //send email
        const content = `<div style="text-align: center; color: gray"><h3>Hello <b> ${user?.Employee?.lastName}  ${user?.Employee?.firstName}</h3> </b> </b>
            <div>token to reset password: ${accessToken}</div>`;
        const mailOptions = {
            to: user.email,
            subject: 'RESET PASSWORD',
            content,
        };
        const mailRes = await sendEmail(mailOptions);
        console.log("email -------------- ", mailRes);
        // create logs
        await createLogs({ action: "reset password", description: "set user password", module: "user", createdBy: userId });
        // return
        return {
            status: 200,
            message: "Success",
            token: accessToken
        };
    }
    /**
    * change user password
    * @param information 
    */
    public static async resetPasswordPost(information: any, accessToken: any) {
        // check if token provided
        if (!accessToken) {
            return {
                status: 403,
                message: "No token provided!"
            };
        }
        // check if token is valid
        const decodedToken: any = await TokenManager.verify(accessToken && accessToken)
        if (!decodedToken) {
            return {
                status: 401,
                message: "Unauthorized!"
            };
        }
        const userId = decodedToken?.userId;
        // check if user exist
        const user = await User.findOne({ where: { id: userId } });
        if (!user) return { status: 404, message: "User not found" };
        // validate password
        if (information.newPassword !== information.confirmNewPassword) {
            return { status: 400, message: "Password doesn't match" };
        }
        // update password
        const password = await hashPassword(information.newPassword);
        const updatedUser = await user.update({ ...user, password });
        // return
        if (updatedUser) {
            // create logs
            await createLogs({ action: "reset password", description: "reset user password", module: "user", createdBy: userId });
            return {
                status: 201,
                message: "Success",
                data: updatedUser,
            };
        }
    }
    /**
     * datatable
     * @returns
     */
    public static async datatable(query: any) {
        const users = await dataTable(User, query, {
            include: [{ model: Role, as: "role" }],
            order: [['createdAt', 'DESC']],
        });
        return { status: 200, message: 'datatable', data: users }
    }
    /**
     * search
     * @param query 
     * @param userId 
     * @returns 
     */
    public static async search(query: any, userId: string) {
        const includes = [{ model: Role, as: "role" }];
        const user = await filter(User, Op, query, includes);
        if (!user) {
            return { status: 404, message: "User not found" };
        }
        return { status: 200, message: 'user', data: user }
    }
}

export default UserService;
