import { Request, Response, NextFunction } from "express";
import { categoryModel } from "../../models/Category";
import { ICategory } from "../../interfaces/category";
import productModel from "../../models/Product";


const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, shortname } = req.body as ICategory;

        await categoryModel.categoryValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const isCategoryExit = await categoryModel.findOne({
            $or: [{ title }, { shortname }],
        }).lean();

        if (isCategoryExit) {
            res.status(409).json({ message: "title or shortname is duplicated" })
        }

        const newCategory = await categoryModel.create({ title, shortname });

        res.status(201).json(newCategory);
        return
    } catch (error) {
        next(error);
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCategories = await categoryModel.find().lean();

        if (!allCategories.length) {
            res
                .status(404)
                .json({ message: "There are no categories available" });
            return
        }
        res.json(allCategories);
        return
    } catch (error) {
        next(error);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id

        await categoryModel.removeCategoryValidation({id}).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedCategory = await categoryModel.findOneAndDelete({
            _id: id,
        });
        if (!deletedCategory) {
            res.status(404).json({ message: "Category Not Found!" });
            return
        }
        await productModel.deleteMany({
            categoryId: deletedCategory._id,
        });
        res.json({ message: "category removed successfully" });
        return
    } catch (error) {
        next(error);
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, shortname } = req.body as ICategory;

        await categoryModel.categoryValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const updatedCategory = await categoryModel.findOneAndUpdate(
            { _id: req.params.id },
            { shortname, title },
            { new: true }
        );
        if (!updatedCategory) {
            res.status(404).json({ message: "Category Not Found!" });
            return
        }
        res.json(updatedCategory);
        return
    } catch (error) {
        next(error);
    }
};

export {
    create,
    getAll,
    remove,
    update
}



