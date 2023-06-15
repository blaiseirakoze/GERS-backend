import joi from 'joi';

export const createEmployeeSchema = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    fatherName: joi.string().allow(null, ""),
    motherName: joi.string().allow(null, ""),
    civilStatus: joi.string().valid('married', 'single', 'divorced', 'widowed').required(),
    birthDate: joi.string().allow(null, ""),
    birthCountry: joi.string().allow(null, ""),
    birthPlace: joi.string().allow(null, ""),
    branches: joi.array().items(joi.object({
        branchId: joi.string().min(3).message('invalid branch').allow("", null),
        departmentId: joi.string().min(3).message('invalid department').allow("", null),
    })),
    roleId: joi.string().min(3).message('invalid role').allow("", null),
    username: joi.string().allow(null, ""),
    category: joi.string().valid("contractual", "under statute").allow(null, ""),
    caisseEntradeStatus: joi.string().valid("active", "blocked").allow(null, ""),

    // Contact Information
    email: joi.string().email().message('invalid email').required(),
    phone: joi.string().allow(null, ""),

    // Employment Information
    employeeGroup: joi.string().allow(null, ""),
    positionId: joi.string().min(3).message('invalid bank').allow("", null),
    echlonId: joi.string().min(3).message('invalid bank').allow("", null),
    levelId: joi.string().min(3).message('invalid bank').allow("", null),
    employmentDate: joi.string().allow(null, ""),
    status: joi.string().valid('retired', 'in service', 'exited').required(),

    // Bank Information
    accountNumber: joi.string().allow(null, ""),
    bankId: joi.string().min(3).message('invalid bank').allow("", null),

    // Medical Insurance Information
    medicalInsurance: joi.string().min(3).message('invalid medical insurance').allow("", null),
    medicalInsuranceNumber: joi.string().min(3).message('invalid medical insurance number').allow("", null),
    crsNumber: joi.string().min(3).message('invalid crs number').allow("", null),
    cardNumber: joi.string().allow("", null)
});