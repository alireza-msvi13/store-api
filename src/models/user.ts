import { IBaseUserInfo, IUser } from "../interfaces/user";
import { loginValidator, registerValidator } from "../modules/auth/auth.validator";
import { Schema, Model, model } from "mongoose";
import { banUserValidator, changeUserRoleValidator, editUserValidator, removeUserValidator, updateUserValidator } from "../modules/user/user.validator";


interface IUserModel extends Model<IUser> {
  //* auth
  registerValidation(body: IBaseUserInfo): Promise<any>;
  loginValidation(body: { email: string; password: string }): Promise<any>;
  //* panel
  removeUserValidation(body: { id: string }): Promise<any>;
  updateUserValidation(body: IBaseUserInfo): Promise<any>;
  banUserValidation(body: { id: string }): Promise<any>;
  editUserValidation(body: IBaseUserInfo): Promise<any>;
  changeUserRoleValidation(body: { id: string, role: "ADMIN" | "USER" }): Promise<any>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
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


//* add yup validation method to mongoose statics


//* auth
userSchema.statics.registerValidation = function (body: IBaseUserInfo) {
  return registerValidator.validate(body, { abortEarly: false });
};

userSchema.statics.loginValidation = function (body: { email: string; password: string }) {
  return loginValidator.validate(body, { abortEarly: false });
};



//* panel
userSchema.statics.removeUserValidation = function (body: { id: string }) {
  return removeUserValidator.validate(body, { abortEarly: false });
};
userSchema.statics.banUserValidation = function (body: { id: string }) {
  return banUserValidator.validate(body, { abortEarly: false });
};
userSchema.statics.updateUserValidation = function (body: IBaseUserInfo) {
  return updateUserValidator.validate(body, { abortEarly: false });
};
userSchema.statics.changeUserRoleValidation = function (body: { id: string, role: string }) {
  return changeUserRoleValidator.validate(body, { abortEarly: false });
};
userSchema.statics.editUserValidation = function (body: IBaseUserInfo) {
  return editUserValidator.validate(body, { abortEarly: false });
};

const userModel: IUserModel = model<IUser, IUserModel>("Users", userSchema);

export default userModel;
