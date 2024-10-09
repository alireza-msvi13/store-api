import { Schema, Model, model, PopulatedDoc, Document, ObjectId } from "mongoose";
import { IProduct } from "../interfaces/product";
import { IUser } from "../interfaces/user";
import { addToWishlistValidator, removeFromWishlistValidator } from "../modules/wishlist/wishlist.validator";


interface IAddWishlist { product: string, user: string }


interface IWishList extends Document {
  user: PopulatedDoc<Document<ObjectId> & IUser>;
  product: PopulatedDoc<Document<ObjectId> & IProduct>;
}

interface IWishlistModel extends Model<IWishList> {
  addToWishlistValidation(body: IAddWishlist): Promise<any>;
  removeFromWishlistValidation(body: { id: string }): Promise<any>;
}

const schema = new Schema<IWishList>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


//* add yup validation method to mongoose statics
schema.statics.addToWishlistValidation = function (body: IAddWishlist) {
  return addToWishlistValidator.validate(body);
};
schema.statics.removeFromWishlistValidation = function (body: { id: string }) {
  return removeFromWishlistValidator.validate(body);
};

const wishListModel: IWishlistModel = model<IWishList, IWishlistModel>("Wishlist", schema);

export default wishListModel;
