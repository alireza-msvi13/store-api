import * as yup from "yup";

const categoryValidator = yup.object().shape({
  title: yup.string().required().min(3).max(20),
});

export {
    categoryValidator
};
