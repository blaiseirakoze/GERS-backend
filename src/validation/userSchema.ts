import joi from 'joi';

export const siginInSchema = joi.object().keys({
    email: joi.string().required(),
    password: joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
        .label('password').required(),
});

export const createUserSchema = joi.object().keys({
    email: joi.string().email().message('invalid email').required(),
    password: joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
        .label('password'),
    confirmPassword: joi.any().valid(joi.ref('password')),
    roleId: joi.string().min(3).message('invalid role').required(),
    employeeId: joi.string().allow(null, ""),
    username: joi.string().allow(null, ""),
    status: joi.string().allow(null, ""),
});

export const changePasswordSchema = joi.object().keys({
    currentPassword: joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
        .label('password').required(),
    newPassword: joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
        .label('password').required(),
    confirmNewPassword: joi.any().valid(joi.ref('newPassword')),
});