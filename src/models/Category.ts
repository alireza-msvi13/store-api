import { Schema, Model, model } from "mongoose";
import { categoryValidator, removeCategoryValidator } from "../modules/category/category.validator";
import { ICategory } from "../interfaces/category";




interface ICategoryModel extends Model<ICategory> {
  categoryValidation(body: ICategory): Promise<any>;
  removeCategoryValidation(body: { id: string }): Promise<any>;
}

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
    },
    shortname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


//* add yup validation method to mongoose statics
categorySchema.statics.categoryValidation = function (body: ICategory) {
  return categoryValidator.validate(body);
};
categorySchema.statics.removeCategoryValidation = function (body: { id: string }) {
  return removeCategoryValidator.validate(body);
};

const categoryModel: ICategoryModel = model<ICategory, ICategoryModel>("Category", categorySchema);

export {
  categoryModel
}
