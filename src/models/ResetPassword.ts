import { Schema, Model, model, PopulatedDoc, Document, ObjectId } from "mongoose";
import { IUser } from "../interfaces/user";
import { forgetPasswordValidator, resetPasswordValidator } from "../modules/auth/auth.validator";

interface IResetPassword extends Document {
  user: PopulatedDoc<Document<ObjectId> & IUser>;
  code: Number;
  codeExpireTime: Date;
}

interface IResetPasswordValidation {
  code: Number;
  password: string;
}

interface IResetPasswordModel extends Model<IResetPassword> {
  forgotPasswordValidation(body: { email: string }): Promise<any>;
  resetPasswordValidation(body: IResetPasswordValidation): Promise<any>;
}


const schema = new Schema<IResetPassword>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  codeExpireTime: {
    type: Date,
    required: true,
  },
});


schema.statics.forgotPasswordValidation = function (body: { email: string }) {
  return forgetPasswordValidator.validate(body, { abortEarly: false });
};

schema.statics.resetPasswordValidation = function (body: IResetPasswordValidation) {
  return resetPasswordValidator.validate(body, { abortEarly: false });
};




const resetPasswordModel: IResetPasswordModel = model<IResetPassword, IResetPasswordModel>("ResetPassword", schema);

export default resetPasswordModel
