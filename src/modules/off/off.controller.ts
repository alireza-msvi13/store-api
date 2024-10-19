import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth";
import offModel from "../../models/Off";
import { IOff } from "../../interfaces/off";
import productModel from "../../models/Product";


const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await offModel.createValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { code, percent, product, max } = req.body;

        const newOff = await offModel.create({
            code,
            percent,
            product,
            max,
            uses: 0,
            creator: req.user?._id,
        });

        res.status(201).json(newOff);
        return
    } catch (error) {
        next(error);
    }
};
const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const allOffs = await offModel
            .find()
            .populate("creator", "-password")
            .lean();
        if (!allOffs.length) {
            res.status(401).json({ message: "No Off Available!" });
            return
        }

        const offs: IOff[] = [];

        allOffs.forEach((off: any) => {
            offs.push({
                ...off,
                creator: off.creator.username,
            });
        });

        res.json(offs);
        return
    } catch (error) {
        next(error);
    }
};

const verfiyDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
    try {

        await offModel.verfiyDiscountCodeValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const { code, product } = req.body;


        const off = await offModel.findOne({ code, product }).lean();


        if (!off) {
            res.status(401).json({ message: "Code is not valid" });
            return
        } else if (off.max === off.uses) {
            res.status(409).json({ message: "This code already used." });
            return
        } else {
            const updatedOff = await offModel.findOneAndUpdate(
                { code, product },
                {
                    uses: off.uses as number + 1,
                },
                {
                    new: true
                }
            );
            res.json(updatedOff);
            return
        }
    } catch (error) {
        next(error);
    }
};

const setOnAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await offModel.setAllValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { discount } = req.body;

        await productModel.updateMany({
            discount,
        });

        res.json({ message: "Discounts set successfully ✌️" });
        return
    } catch (error) {
        next(error);
    }
};
const removeDiscounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productModel.updateMany({
            discount: 0,
        });


        res.json({ message: "Discounts removed successfully." });
        return
    } catch (error) {
        next(error);
    }
};


const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await offModel.removeValidation({ id: req.params.id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedOff = await offModel.findOneAndDelete({
            _id: req.params.id,
        });
        if (!deletedOff) {
            res.status(401).json({ message: "Off Code Not Found!" });
            return
        }
        res.json(deletedOff);
        return
    } catch (error) {
        next(error);
    }
};

export {
    create,
    getAll,
    verfiyDiscountCode,
    setOnAll,
    removeDiscounts,
    remove
}