import { Schema, Model, model } from "mongoose";
import { categoryValidator } from "../modules/category/category.validator";



interface ICategory extends Document {
  title: string;
}

interface ICategoryModel extends Model<ICategory> {
  categoryValidation(body: ICategory): Promise<string>;
}

const categorySchema = new Schema<ICategory>(
  {
    title: {
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

const categoryModel: ICategoryModel = model<ICategory,ICategoryModel>("Category", categorySchema);

export {
  categoryModel
}
