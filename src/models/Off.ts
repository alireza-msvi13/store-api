import { Schema, Model, model } from "mongoose";
import { createOffValidator, removeOffValidator, setDiscountOnAllValidator, verfiyDiscountCodeValidator } from "../modules/off/off.validator";
import { IOff } from "../interfaces/off";


interface IOffModel extends Model<IOff> {
  createValidation(body: IOff): Promise<any>;
  verfiyDiscountCodeValidation(body: { code: string, product: string }): Promise<any>;
  removeValidation(body: { id: string }): Promise<any>;
  setAllValidation(body: { discount: string }): Promise<any>;
}


const offSchema = new Schema<IOff>(
  {
    code: {
      type: String,
      required: true,
    },
    percent: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    uses: {
      type: Number,
      required: true,
      default: 0
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
offSchema.statics.verfiyDiscountCodeValidation = function (body: { code: string, product: string }) {
  return verfiyDiscountCodeValidator.validate(body, { abortEarly: false });
};
offSchema.statics.createValidation = function (body: IOff) {
  return createOffValidator.validate(body, { abortEarly: false });
};
offSchema.statics.removeValidation = function (body: { id: string }) {
  return removeOffValidator.validate(body, { abortEarly: false });
};
offSchema.statics.setAllValidation = function (body: { discount: string }) {
  return setDiscountOnAllValidator.validate(body, { abortEarly: false });
};

const offModel: IOffModel = model<IOff, IOffModel>("Off", offSchema);

export default offModel;
