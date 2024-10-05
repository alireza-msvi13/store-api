import * as yup from "yup";

const createCommentValidator = yup.object().shape({
  body: yup.string().required().min(5).max(50),
  productShortName: yup.string().required("product short name is required"),
  score: yup
    .number()
    .integer()
    .min(1)
    .max(5)
    .required(),
}).strict().noUnknown(true, "Unknown field is not allowed");

const answerCommentValidator = yup.object().shape({
  body: yup.string().required().min(5).max(50),
}).strict().noUnknown(true, "Unknown field is not allowed");

const commentIdValidator = yup.object().shape({
  id: yup
    .string()
    .required()
    .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
  createCommentValidator,
  answerCommentValidator,
  commentIdValidator,
};
