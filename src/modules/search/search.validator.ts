import * as yup from "yup";


const searchValidator = yup.object().shape({
  value: yup.string().required().max(30),
}).strict().noUnknown(true, "Unknown field is not allowed");

export {
  searchValidator,
};
