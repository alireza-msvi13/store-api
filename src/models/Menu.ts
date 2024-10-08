import { Schema, Model, model } from "mongoose";
import { createMenuValidator, removeMenuValidator } from "../modules/menu/menu.validator";
import { IMenu } from "../interfaces/menu";


interface IMenuModel extends Model<IMenu> {
  createValidation(body: IMenu): Promise<any>;
  removeValidation(body: { id: string }): Promise<any>;
}


const menuSchema = new Schema<IMenu>(
  {
    title: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: false,
    },
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
menuSchema.statics.createValidation = function (body: IMenu) {
  return createMenuValidator.validate(body, { abortEarly: false });
};
menuSchema.statics.removeValidation = function (body: { id: string }) {
  return removeMenuValidator.validate(body, { abortEarly: false });
};

const menuModel: IMenuModel = model<IMenu, IMenuModel>("Menu", menuSchema);

export default menuModel;
