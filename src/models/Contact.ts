import { Schema, Model, model } from "mongoose";
import { answerValidator, createContactValidator, removeValidator } from "../modules/contact/contact.validator";
import { IContact } from "../interfaces/contact";


interface IContactModel extends Model<IContact> {
  createValidation(body: IContact): Promise<any>;
  answerValidation(body: { email: string, answer: string }): Promise<any>;
  removeValidation(body: { id: string }): Promise<any>;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
contactSchema.statics.createValidation = function (body: IContact) {
  return createContactValidator.validate(body, { abortEarly: false });
};
contactSchema.statics.answerValidation = function (body: { email: string, answer: string }) {
  return answerValidator.validate(body, { abortEarly: false });
};
contactSchema.statics.removeValidation = function (body: { id: string }) {
  return removeValidator.validate(body, { abortEarly: false });
};

const contactModel: IContactModel = model<IContact, IContactModel>("Contact", contactSchema);

export {
  contactModel
} 
