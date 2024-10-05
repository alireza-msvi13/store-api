import { Schema, Model, model } from "mongoose";
import { answerCommentValidator, commentIdValidator, createCommentValidator } from "../modules/comment/comment.validator";
import { IComment } from "../interfaces/comment";



interface ICommentModel extends Model<IComment> {
  createValidation(body: IComment): Promise<any>;
  answerValidation(body: { body: string }): Promise<any>;
  commentIdValidation(body: { id: string }): Promise<any>;
}

const commentSchema = new Schema<IComment>(
  {
    body: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    accept: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      default: 5
    },
    isAnswer: {
      type: Boolean,
      default: false
    },
    mainCommendID: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
commentSchema.statics.createValidation = function (body: IComment) {
  return createCommentValidator.validate(body, { abortEarly: false });
};
commentSchema.statics.answerValidation = function (body: { body: string }) {
  return answerCommentValidator.validate(body, { abortEarly: false });
};
commentSchema.statics.commentIdValidation = function (body: { id: string }) {
  return commentIdValidator.validate(body, { abortEarly: false });
};

const commentModel: ICommentModel = model<IComment, ICommentModel>("Comment", commentSchema);

export default commentModel;
