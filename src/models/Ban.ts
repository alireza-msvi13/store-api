import { Schema, Model, model } from "mongoose";

interface IBanUser extends Document {
  phone: string;
  email: string;
}

type BanUserType = Model<IBanUser>;

const banUserSchema = new Schema<IBanUser>(
  {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const banUserModel:BanUserType = model<IBanUser>("Ban", banUserSchema);

export default banUserModel;
