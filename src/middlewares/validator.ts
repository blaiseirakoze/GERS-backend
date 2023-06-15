const validate = (schema) => async (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,
    });
    console.log(req.body)
    if (error) {
        const { details } = error;
        const errors = details.map((detail) => detail.message.replace('"', '').replace('"', ''));
        return res.status(400).json({ status: 400, message: errors });
    }
    return next();
};
export default validate;
