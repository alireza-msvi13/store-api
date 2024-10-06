import { Request, Response, NextFunction } from "express";
import { IArticle } from "../../interfaces/article";
import { articleModel } from "../../models/Article";
import { AuthenticatedRequest } from "../../interfaces/auth";
import path from "path";
import fs from "fs"


const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, body, shortname, categoryId } = req.body as IArticle;
        const cover = req.file;

        await articleModel.articleValidation({ ...req.body, cover }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const duplicatedshortname = await articleModel.findOne({ shortname });

        if (duplicatedshortname) {
            res.status(401).json({ message: "duplicated short name" });
            return
        }



        const article = await articleModel.create({
            title,
            description,
            shortname,
            body,
            creator: req.user?._id,
            categoryId,
            cover: req.file?.filename,
            publish: true,
        });

        const populatedArticle = await article.populate("creator", "username");

        res.status(201).json(populatedArticle);
        return
    } catch (error) {
        next(error);
    }
};
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articles = await articleModel
            .find()
            .populate("categoryId", "title")
            .populate("creator", "username")
            .sort({ _id: -1 });

        if (!articles.length) {
            res.status(404).json({ message: "No Article Available!" });
            return
        }

        res.json(articles);
        return
    } catch (error) {
        next(error);
    }
};
const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const article = await articleModel
            .findOne({ shortname: req.params.shortname })
            .populate("categoryId", "title")
            .populate("creator", "username")
            .lean();

        if (!article) {
            res.status(404).json({ message: "Article Not Found!" });
            return
        }

        res.json(article);
        return
    } catch (error) {
        next(error);
    }
};
const saveDraft = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, body, shortname, categoryId } = req.body as IArticle;
        const cover = req.file;

        await articleModel.articleValidation({ ...req.body, cover }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const duplicatedshortname = await articleModel.findOne({ shortname });

        if (duplicatedshortname) {
            res.status(401).json({ message: "duplicated short name" });
            return
        }



        const article = await articleModel.create({
            title,
            description,
            shortname,
            body,
            creator: req.user?._id,
            categoryId,
            cover: req.file?.filename,
        });

        const populatedArticle = await article.populate("creator", "username");

        res.status(201).json(populatedArticle);
        return
    } catch (error) {
        next(error);
    }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id

        await articleModel.removeArticleValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });


        const deletedArticle = await articleModel.findOneAndDelete({
            _id: id,
        });
        if (!deletedArticle) {
            res.status(404).json({ message: "Article Not Found!" });
            return
        }

        const imgPath = deletedArticle.cover
            ? path.join(__dirname, "..", "..", "..", "public", "covers", deletedArticle.cover)
            : '';

        if (imgPath) {
            await fs.promises.unlink(imgPath);
        }

        res.json({message: "article removed successfully"});
        return
    } catch (error) {
        next(error);
    }
};

export {
    create,
    getAll,
    getOne,
    saveDraft,
    remove
}