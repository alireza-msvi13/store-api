import { Schema, Model, model } from "mongoose";

import { productValidator, removeProductValidator } from "../modules/product/product.validator";
import { IProduct } from "../interfaces/product";



interface IProductModel extends Model<IProduct> {
  productValidation(body: IProduct): Promise<any>;
  removeProductValidation(body: { id: string }): Promise<any>;
}


const schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    shortname: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
    stock: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },

  },
  { timestamps: true }
);

schema.statics.productValidation = function (body: IProduct) {
  return productValidator.validate(body);
};

schema.statics.removeProductValidation = function (body: { id: string }) {
  return removeProductValidator.validate(body);
};


const productModel: IProductModel = model<IProduct, IProductModel>("Product", schema);

export default productModel;
