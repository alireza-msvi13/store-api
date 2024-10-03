import { IUser } from "../interfaces/user";
import { loginValidator, registerValidator } from "../modules/auth/auth.validator";
import { Schema, Model, model } from "mongoose";
import { banUserValidator, changeUserRoleValidator, editUserValidator, removeUserValidator, updateUserValidator } from "../modules/user/user.validator";


interface IUserModel extends Model<IUser> {
  //* auth
  registerValidation(body: Partial<IUser>): Promise<any>;
  loginValidation(body: Partial<IUser>): Promise<any>;
  //* panel
  removeUserValidation(body: Partial<IUser>): Promise<any>;
  updateUserValidation(body: Partial<IUser>): Promise<any>;
  banUserValidation(body: Partial<IUser>): Promise<any>;
  editUserValidation(body: Partial<IUser>): Promise<any>;
  changeUserRoleValidation(body: Partial<IUser>): Promise<any>;
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
userSchema.statics.registerValidation = function (body: Partial<IUser>) {
  return registerValidator.validate(body, { abortEarly: false });
};

userSchema.statics.loginValidation = function (body: Partial<IUser>) {
  return loginValidator.validate(body, { abortEarly: false });
};



//* panel
userSchema.statics.removeUserValidation = function (body: Partial<IUser>) {
  return removeUserValidator.validate(body, { abortEarly: false });
};
userSchema.statics.banUserValidation = function (body: Partial<IUser>) {
  return banUserValidator.validate(body, { abortEarly: false });
};
userSchema.statics.updateUserValidation = function (body: Partial<IUser>) {
  return updateUserValidator.validate(body, { abortEarly: false });
};
userSchema.statics.changeUserRoleValidation = function (body: Partial<IUser>) {
  return changeUserRoleValidator.validate(body, { abortEarly: false });
};
userSchema.statics.editUserValidation = function (body: Partial<IUser>) {
  return editUserValidator.validate(body, { abortEarly: false });
};

const userModel: IUserModel = model<IUser, IUserModel>("Users", userSchema);

export default userModel;
