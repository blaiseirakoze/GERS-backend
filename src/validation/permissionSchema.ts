import joi from 'joi';

export const createPermissionSchema = joi.object().keys({
    name: joi.string().min(2).message('invalid name').required(),
    create: joi.string().min(2).message('invalid create value').allow("", null),
    update: joi.string().min(2).message('invalid update value').allow("", null),
    view: joi.string().min(2).message('invalid view value').allow("", null),
    delete: joi.string().min(2).message('invalid delete value').allow("", null),
    userId: joi.string().min(2).message('invalid user').allow("", null)
});