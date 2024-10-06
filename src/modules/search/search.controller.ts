import { Request, Response, NextFunction } from "express";
import { searchValidator } from "./search.validator";
import productModel from "../../models/Product";
import { articleModel } from "../../models/Article";


const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value } = await searchValidator.validate(req.params);
        const regex = new RegExp(value, "i");

        const allResultProduct = await productModel.find({
            name: regex,
        });
        const allResultArticles = await articleModel.find({
            title: regex,
        });

        res.json({ allResultProduct, allResultArticles });
        return
    } catch (error) {
        next(error);
    }
};


export { get }