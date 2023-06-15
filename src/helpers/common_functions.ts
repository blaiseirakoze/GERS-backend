
import { v4 as uuidv4 } from "uuid";
import { Sequelize } from "sequelize";
export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0
}

/**
 * reusable filter
 * @param Obj 
 * @param Op 
 * @param query 
 * @param includes 
 * @returns 
 */
export const filter = async (Obj, Op, query, includes?) => {
    const filterParams = {};
    for (const [key, value] of Object.entries(query)) {
        filterParams[key] = { [Op.like]: `%${value}%` };
    }
    const obj = await Obj.findAll({
        where: filterParams,
        include: includes
    });
    return obj;
}

/**
 * 
 * @param arrayList 
 * @param needle 
 * @returns true or false
 */
export const inArray = (arrayList, needle) => {
    if (!arrayList) {
        return false;
    }
    return arrayList.filter(v => v === needle).length > 0;
}