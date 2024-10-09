const yup = require("yup");

const removeFromWishlistValidator = yup.object().shape({
    id: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "product id is not valid"),
});
const addToWishlistValidator = yup.object().shape({
    product: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "product id is not valid"),
    user: yup
        .string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/, "product id is not valid"),
});
export {
    removeFromWishlistValidator,
    addToWishlistValidator
}