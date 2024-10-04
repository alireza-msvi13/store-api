import * as yup from "yup";

const productValidator = yup.object({
    name: yup.string().required().min(5).max(20),
    shortname: yup.string().required().min(5).max(20),
    brand: yup.string().required().min(3).max(20),
    color: yup.string().required().min(3).max(10),
    price: yup.number().required().min(0),
    discount: yup.number().min(0).max(100),
    stock: yup.number().required().min(0).max(40),
    cover: yup.object({
      size: yup
        .number()
        .max(3 * 1024 * 1024, "The size of the product cover cannot be more than 3 MB"),
      mimetype: yup
        .string()
        .oneOf(
          ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          "Product cover format is not valid"
        )
        .required(),
    }),
    categoryId: yup
      .string()
      .required()
      .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
  }).strict().noUnknown(true, "Unknown field is not allowed");

const removeProductValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");


export {
    productValidator,
    removeProductValidator
}