import * as yup from "yup";


// * Remove User

const removeUserValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id in not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

// * Ban User

const banUserValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id in not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

// * Edit User

const editUserValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id in not valid"),
    role: yup
        .string()
        .oneOf(["ADMIN", "USER"], "The user role must be one of the values ADMIN and USER"),
    username: yup
        .string()
        .required()
        .min(5)
        .max(20),
    email: yup
        .string()
        .email()
        .max(40)
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "email is not valid"
        )
        .required(),
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

// * Update User

const updateUserValidator = yup.object().shape({
    username: yup
        .string()
        .required()
        .min(5)
        .max(20),
    email: yup
        .string()
        .email()
        .max(40)
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "email is not valid"
        )
        .required(),
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

// * Change Role User

const changeUserRoleValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id in not valid"),
    role: yup
        .string()
        .required()
        .oneOf(["ADMIN", "USER"], "The user role must be one of the values ADMIN and USER"),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
    removeUserValidator,
    banUserValidator,
    editUserValidator,
    updateUserValidator,
    changeUserRoleValidator,
};
