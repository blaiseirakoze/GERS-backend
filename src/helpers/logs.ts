import model from "../database/models";
import IP from 'ip';
import { detect } from 'detect-browser';

const { Logs } = model;
/**
 * create logs function
 * @param data
 * @returns
 */
export const createLogs = async (data: any, transaction?: any) => {
    const browser = detect();
    const ipAddress = IP.address();
    const browserName = browser.name;
    const browserVersion = browser.version;
    const browserOs = browser.os;
    const logsCreated = await Logs.create({ ...data, ip: ipAddress, browser: `name: ${browserName}, version: ${browserVersion}, os: ${browserOs}` }, { transaction });
    return {
        status: 201,
        message: "Success",
        data: logsCreated
    };
}
