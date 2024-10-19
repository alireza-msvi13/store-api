import { Request, Response, NextFunction } from "express";
import productModel from "../../models/Product";
import { IProduct } from "../../interfaces/product";
import path from "path";
import fs from "fs"
import commentModel from "../../models/Comment";


const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cover = req.file;

        const {
            name,
            shortname,
            brand,
            color,
            price: priceString,
            discount: discountString,
            stock: stockString,
            categoryId
        } = req.body as IProduct;

        //! Convert price, discount, and stock to numbers before validation for postman form-data

        const price = Number(priceString);
        const discount = discountString ? Number(discountString) : 0;
        const stock = Number(stockString);

        await productModel.productValidation({
            ...req.body,
            cover,
            price,
            discount,
            stock
        }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const course = await productModel.create({
            name,
            shortname,
            brand,
            color,
            price,
            stock,
            categoryId,
            cover: req.file?.filename,
            discount
        });

        res.status(201).json(course);
        return;
    } catch (error) {
        next(error);
    }
};
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productModel
            .find()
            .populate("categoryId")
            .lean()
            .sort({ _id: -1 });

        if (!products) {
            res.status(401).json({ message: "No Product Available!" });
            return
        }

        // const registers = await courseUserModel.find({}).lean();
        // const comments = await commentModel.find().lean();

        // let allCourses = [];
        // courses.forEach((course) => {
        //     let courseTotalScore = 5;
        //     let courseRegisters = registers.filter(
        //         (register) => register.course.toString() === course._id.toString()
        //     );

        //     let courseScores = comments.filter(
        //         (comment) => comment.course.toString() === course._id.toString()
        //     );

        //     courseScores.forEach((comment) => {
        //         courseTotalScore += Number(comment.score);
        //     });

        //     allCourses.push({
        //         ...course,
        //         categoryID: course.categoryID,
        //         creator: course.creator.name,
        //         registers: courseRegisters.length,
        //         courseAverageScore: Math.floor(
        //             courseTotalScore / (courseScores.length + 1)
        //         ),
        //     });
        // });

        res.json(products);
        return
    } catch (error) {
        next(error);
    }
};
const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id

        await productModel.removeProductValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const product = await productModel.findOne({
            _id: req.params.id,
        }).lean();

        if (!product) {
            res.status(401).json({ message: "Product Not Found!" });
            return
        }


        res.json(product);
        return
    } catch (error) {
        next(error);
    }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id

        await productModel.removeProductValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const deletedProduct = await productModel.findOneAndDelete({
            _id: req.params.id,
        });

        if (!deletedProduct) {
            res.status(401).json({ message: "Product Not Found!" });
            return
        }
        await commentModel.deleteMany({
            product: deletedProduct._id,
        });


        res.json({ message: "Product Removed Successfully" });
        return
    } catch (error) {
        next(error);
    }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cover = req.file;

        const {
            name,
            shortname,
            brand,
            color,
            price: priceString,
            discount: discountString,
            stock: stockString,
            categoryId
        } = req.body as IProduct;

        //! Convert price, discount, and stock to numbers before validation for postman form-data

        const price = Number(priceString);
        const discount = discountString ? Number(discountString) : 0;
        const stock = Number(stockString);


        await productModel.productValidation({
            ...req.body,
            cover,
            price,
            discount,
            stock
        }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });


        const oldProduct = await productModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                name,
                shortname,
                brand,
                color,
                price,
                stock,
                categoryId,
                cover: Boolean(req.file?.filename) === true ? req.file?.filename : undefined,
                discount: Boolean(discount) === true ? discount : 0,
            }
        );
        if (!oldProduct) {
            res.status(401).json({ message: "Product Not Update!" });
            return
        }

        const newProduct = await productModel.findById(oldProduct._id).lean()

        if (oldProduct.cover !== newProduct?.cover) {
            const imgPath = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "public",
                "covers",
                oldProduct.cover
            );

            fs.unlink(imgPath, async (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        res.status(200).json(newProduct);
        return
    } catch (error) {
        next(error);
    }
};
export {
    create,
    remove,
    getAll,
    update,
    getOne
}