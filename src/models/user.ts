import { IUser } from "../interfaces/user";
import { loginValidator, registerValidator } from "../modules/auth/auth.validator";
import { Schema, Model, model } from "mongoose";
interface IUserModel extends Model<IUser> {
  registerValidation(body: Partial<IUser>): Promise<any>;
  loginValidation(body: Partial<IUser>): Promise<any>;
}

const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    postalCode: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.registerValidation = function (body: Partial<IUser>) {
  return registerValidator.validate(body, { abortEarly: false });
};

userSchema.statics.loginValidation = function (body: Partial<IUser>) {
  return loginValidator.validate(body, { abortEarly: false });
};

const userModel: IUserModel = model<IUser, IUserModel>("Users", userSchema);

export default userModel;
