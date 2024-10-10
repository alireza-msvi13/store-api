import * as yup from "yup";


const createContactValidator = yup.object().shape({
    name: yup
        .string()
        .required()
        .min(5)
        .max(20),
    email: yup
        .string()
        .email()
        .max(40)
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            "email is not valid"
        )
        .required(),
    phone: yup
        .string()
        .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
        .required(),
    message: yup
        .string()
        .max(45)
        .min(8)
        .required(),

}).strict().noUnknown(true, "Unknown field is not allowed");

const answerValidator = yup.object().shape({
    name: yup
        .string()
        .required()
        .min(5)
        .max(20),
    email: yup
        .string()
        .email()
        .max(40)
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            "email is not valid"
        )
        .required(),
    answer: yup
        .string()
        .max(45)
        .min(8)
        .required(),
}).strict().noUnknown(true, "Unknown field is not allowed");

const removeValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
    createContactValidator,
    answerValidator,
    removeValidator,
};
