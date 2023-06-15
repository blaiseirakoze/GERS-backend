import joi from 'joi';

export const createSchema = joi.object().keys({
    name: joi.string().min(2).message('invalid name').required(),
    location: joi.string().min(2).message('invalid location').allow("", null),
    zoneId: joi.string().required(),

});