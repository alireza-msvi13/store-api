import * as yup from "yup";

// Register Schema
const registerValidator = yup.object().shape({
    fullname: yup
        .string()
        .required()
        .min(5)
        .max(20),
    email: yup
        .string()
        .email()
        .max(40)
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "ایمیل نامتعبر است"
        )
        .required("email must be a valid email"),
    phone: yup
        .string()
        .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, "phone must be a valid phone")
        .required(),
    password: yup
        .string()
        .max(25)
        .min(8)
        .required(),

}).strict().noUnknown(true, "Unknown field is not allowed");

// Login Schema
const loginValidator = yup.object().shape({
    email: yup
        .string()
        .email()
        .max(40)
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "ایمیل نامتعبر است"
        )
        .required("email must be a valid email"),
    password: yup
        .string()
        .max(25)
        .min(8)
        .required(),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
    registerValidator,
    loginValidator,
};
