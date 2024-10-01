import { Schema, Model, model, PopulatedDoc, Document, ObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user";


interface IRefreshToken extends Document {
  user: PopulatedDoc<Document<ObjectId> & IUser>;
  token: string;
  expire: Date;
}

interface IRefreshTokenModel extends Model<IRefreshToken> {
  createToken(user: IUser): Promise<string>;
  verifyToken(token: string): Promise<IUser | null>;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expire: {
    type: Date,
    required: true,
  },
});

// Static method to create a token
refreshTokenSchema.statics.createToken = async function (user: IUser): Promise<string> {
  const expireInDays = 20;

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET_KEY as string,
    { expiresIn: "20d" }
  );

  const refreshTokenDocument = new this({
    token: refreshToken,
    user: user._id,
    expire: new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000),
  });

  await refreshTokenDocument.save();

  return refreshToken;
};

// Static method to verify a token
refreshTokenSchema.statics.verifyToken = async function (token: string): Promise<IUser | null> {
  const refreshTokenDocument = await this.findOne({ token });

  if (refreshTokenDocument && refreshTokenDocument.expire >= new Date()) {
    await this.findOneAndUpdate({ token: refreshTokenDocument.token }, { token })
    return refreshTokenDocument.user as IUser;
  } else {
    return null;
  }
};

// Create the model
const refreshTokenModel: IRefreshTokenModel = model<IRefreshToken, IRefreshTokenModel>("RefreshToken", refreshTokenSchema);

export default refreshTokenModel;
