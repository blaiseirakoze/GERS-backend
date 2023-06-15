import joi from 'joi';

export const createLeaveSchema = joi.object().keys({
    leaveTypeId: joi.string().required(),
    numberOfDays: joi.number().required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    reason: joi.string().required(),
});
export const approveLeaveSchema = joi.object().keys({
    comment: joi.string().required(),
    status: joi.string().required(),
});
