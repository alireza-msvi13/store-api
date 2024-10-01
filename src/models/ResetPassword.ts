import { Schema, Model, model, PopulatedDoc, Document, ObjectId } from "mongoose";
import { IUser } from "../interfaces/user";
import { forgetPasswordValidator, resetPasswordValidator } from "../modules/auth/auth.validator";

interface IResetPassword extends Document {
  user: PopulatedDoc<Document<ObjectId> & IUser>;
  token: string;
  tokenExpireTime: Date;
}

interface IResetPasswordModel extends Model<IResetPassword> {
  forgotPasswordValidation(body: Partial<IResetPassword>): Promise<any>;
  resetPasswordValidation(body: Partial<IResetPassword>): Promise<any>;
}


const schema = new Schema<IResetPassword>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenExpireTime: {
    type: Date,
    required: true,
  },
});


schema.statics.forgotPasswordValidation = function (body: Partial<IResetPassword>) {
  return forgetPasswordValidator.validate(body, { abortEarly: false });
};

schema.statics.resetPasswordValidation = function (body: Partial<IResetPassword>) {
  return resetPasswordValidator.validate(body, { abortEarly: false });
};




const resetPasswordModel: IResetPasswordModel = model<IResetPassword,IResetPasswordModel>("ResetPassword", schema);

export default resetPasswordModel
