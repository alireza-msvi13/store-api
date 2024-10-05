import { Request, Response, NextFunction } from "express";
import commentModel from "../../models/Comment";
import productModel from "../../models/Product";
import { AuthenticatedRequest } from "../../interfaces/auth";
import { IComment } from "../../interfaces/comment";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allComments = await commentModel
            .find().populate("creator", "username -_id").populate("product", "name").lean()

        if (allComments.length === 0) {
            res.status(404).json({ message: "No comments found!" });
            return
        }
        const comments: Array<IComment> = [];

        allComments.forEach((comment: any) => {
            if (comment.accept) {
                let mainCommentAnswerInfo: any[] = [];
                allComments.forEach((answerComment: any) => {
                    if (String(comment._id) === String(answerComment.mainCommendID)) {
                        mainCommentAnswerInfo.push({ ...answerComment });
                    }
                });

                if (!comment.mainCommendID) {
                    comments.push({
                        ...comment,
                        product: comment.product.name,
                        answerContent: mainCommentAnswerInfo,
                    });
                }
            }
        });

        if (!comments.length) {
            res.status(404).json({ message: "No comments found!" });
            return
        }

        res.json(comments);
        return
    } catch (error) {
        next(error);
    }
};
const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {


        await commentModel.createValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { body, productShortName, score } = req.body;

        const product = await productModel.findOne({ shortname: productShortName }).lean();

        if (!product) {
            res.status(404).json({ message: "Product Not Found!" });
            return
        }

        const comment = await commentModel.create({
            body,
            product: product._id,
            creator: req.user?._id,
            score,
        });

        res.status(201).json(comment);
        return
    } catch (error) {
        next(error);
    }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id
        await commentModel.commentIdValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedComment = await commentModel.findOneAndDelete({
            _id: id,
        });
        if (!deletedComment) {
            res.status(404).json({ message: "Comment Not Found!" });
            return
        }
        res.json({ message: "comment removed successfully" });
        return
    } catch (error) {
        next(error);
    }
};
const answer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { body } = req.body as { body: string };

        await commentModel.answerValidation({ body }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });


        const mainComment = await commentModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                accept: req.user?.role === "ADMIN" ? true : false,
            },
            { new: true }
        );


        const answerToComment = await commentModel.create({
            body,
            product: mainComment?.product,
            creator: req.user?._id,
            accept: req.user?.role === "ADMIN" ? true : false,
            isAnswer: true,
            mainCommendID: req.params.id,
        });

        res.json(answerToComment);
        return 
    } catch (error) {
        next(error);
    }
};
const accept = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        await commentModel.commentIdValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const acceptedComment = await commentModel.findOneAndUpdate(
            { _id: id },
            {
                accept: true,
            },
            { new: true }
        );
        if (!acceptedComment) {
          res.status(404).json({ message: "Comment Not Found!" });
          return 
        }

        res.json({message: "comment accept successfully"});
        return 
    } catch (error) {
        next(error);
    }
};
const reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        await commentModel.commentIdValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const acceptedComment = await commentModel.findOneAndUpdate(
            { _id: id },
            {
                accept: false,
            },
            { new: true }
        );
        if (!acceptedComment) {
            res.status(404).json({ message: "Comment Not Found!" });
            return 
        }

        res.json({message: "comment reject successfully"});
        return 
    } catch (error) {
        next(error);
    }
};


export {
    create,
    getAll,
    remove,
    answer,
    reject,
    accept
}