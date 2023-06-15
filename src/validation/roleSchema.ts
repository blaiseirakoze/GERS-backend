import joi from 'joi';

export const createRoleSchema = joi.object().keys({
    name: joi.string().min(3).message('invalid name').required(),
    label: joi.string().min(3).message('invalid label').required(),
});