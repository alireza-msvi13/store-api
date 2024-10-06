const yup = require("yup");

const createOffValidator = yup.object().shape({
    code: yup.string().required().max(15).min(4),
    percent: yup.number().required().min(0).max(100),
    product: yup.string().required()
        .matches(/^[0-9a-fA-F]{24}$/, "product id is not valid"),
    max: yup.number().required().min(1),
});

const verfiyDiscountCodeValidator = yup.object().shape({
    code: yup.string().required().max(15),
    product: yup.string().required()
        .matches(/^[0-9a-fA-F]{24}$/, "product id is not valid"),
});

const removeOffValidator = yup.object().shape({
    id: yup.string().required()
        .matches(/^[0-9a-fA-F]{24}$/, "product id is not valid"),
});

const setDiscountOnAllValidator = yup.object().shape({
    discount: yup.number().required().min(0).max(100),
});

export {
    verfiyDiscountCodeValidator,
    createOffValidator,
    removeOffValidator,
    setDiscountOnAllValidator,
};
