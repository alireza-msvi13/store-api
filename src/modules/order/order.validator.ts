import * as yup from "yup";


const createOrderValidator = yup.object().shape({
    message: yup.string().max(50),
    user: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "Id is not valid"),
    products: yup
        .array()
        .of(
            yup.object().shape({
                productId: yup
                    .string()
                    .required('Product ID is required')
                    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
                count: yup
                    .number()
                    .required('count is required')
                    .min(1, 'count must be at least 1'),
                color: yup.string().required()
            })
        )
        .min(1, 'At least one product must be selected')
        .required('Products are required')
}).strict().noUnknown(true, "Unknown field is not allowed");


const changeStatusValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "Id is not valid"),
    status:yup.string().oneOf(["IN_PROGRESS", "DISPATCHED", "COMPLETED"],
         "The status must be IN_PROGRESS or DISPATCHED or COMPLETED").required()
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
    createOrderValidator,
    changeStatusValidator,
};
