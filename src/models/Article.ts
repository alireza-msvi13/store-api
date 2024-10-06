import { Schema, Model, model } from "mongoose";
import { IArticle } from "../interfaces/article";
import { articleValidator, removeArticleValidator } from "../modules/article/article.validator";


interface IArticleModel extends Model<IArticle> {
  articleValidation(body: IArticle): Promise<any>;
  removeArticleValidation(body: { id: string }): Promise<any>;
}


const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    shortname: {
      type: String,
      required: true,
      unique: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publish: {
      type: Boolean,
      default: false

    },
  },
  { timestamps: true }
);

articleSchema.statics.articleValidation = function (body: IArticle) {
  return articleValidator.validate(body, { abortEarly: false });
};
articleSchema.statics.removeArticleValidation = function (body: { id: string }) {
  return removeArticleValidator.validate(body, { abortEarly: false });
};

const articleModel: IArticleModel = model<IArticle, IArticleModel>("Article", articleSchema);

export {
  articleModel
}
