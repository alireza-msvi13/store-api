import * as yup from "yup";


const createMenuValidator = yup.object().shape({
    title: yup.string().required().max(30),
    href: yup.string().required().max(30),
    parent: yup
        .string()
        .nullable()
        .matches(/^[0-9a-fA-F]{24}$/, "parent id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

const removeMenuValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "Id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
    createMenuValidator,
    removeMenuValidator,
};
