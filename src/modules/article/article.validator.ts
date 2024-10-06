import * as yup from "yup";

//* article schema
const articleValidator = yup.object().shape({
    title: yup.string().trim().min(5).max(50).required(),
    description: yup
        .string()
        .required().max(100),
    body: yup.string().required().max(300),
    shortname: yup
        .string()
        .trim()
        .required(),
    cover: yup.object().shape({
        size: yup
            .number()
            .max(3 * 1024 * 1024, "The size of the Article cover cannot be more than 3 MB"),
        mimetype: yup
            .string()
            .oneOf(
                ["image/jpeg", "image/jpg", "image/png", "image/webp"],
                "Article cover format is not valid"
            )
            .required("Article cover is a required fild"),
    }),
    categoryId: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "category id is not valid"),
});

const removeArticleValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "id is not valid"),
}).strict().noUnknown(true, "Unknown field is not allowed");



export {
    removeArticleValidator,
    articleValidator
}