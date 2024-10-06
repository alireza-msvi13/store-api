import * as yup from "yup";

const createTicketValidator = yup.object().shape({
  title: yup.string().required().min(3).max(50),
  body: yup.string().required().min(3).max(50),
}).strict().noUnknown(true, "Unknown field is not allowed");

const getAnswerValidator = yup.object().shape({
  id: yup.string().required()
    .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");

const setAnswerValidator = yup.object().shape({
  body: yup.string().required(),
  ticketId: yup.string().required(),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
  createTicketValidator,
  getAnswerValidator,
  setAnswerValidator,
};
