import * as yup from "yup";

const categoryValidator = yup.object().shape({
  title: yup.string().required().min(3).max(20),
  shortname: yup.string().required().min(3).max(20),
}).strict().noUnknown(true, "Unknown field is not allowed");

const removeCategoryValidator = yup.object().shape({
  id: yup
    .string()
    .required()
    .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
  categoryValidator,
  removeCategoryValidator
};
