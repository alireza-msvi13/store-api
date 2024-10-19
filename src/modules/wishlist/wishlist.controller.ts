import { Request, Response, NextFunction } from "express";
import wishListModel from "../../models/Wishlist";
import { AuthenticatedRequest } from "../../interfaces/auth";


const add = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const user = req.user?._id
        const { product } = req.body;

        await wishListModel.addToWishlistValidation({ ...req.body, user }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const isProductExist = await wishListModel.findOne({ user, product }).lean()

        if (isProductExist) {
            res.status(409).json({ message: "this product exist in this user wishlist" });
            return
        }

        const newWishListProduct = await wishListModel.create({ user, product });

        res.status(201).json(newWishListProduct);
        return
    } catch (error) {
        next(error);
    }
};
const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const userWishlist = await wishListModel.find({ user: req.user?._id }).lean().populate("product");

        if (!userWishlist.length) {
            res
                .status(401)
                .json({ message: "There are no item in wishlist" });
            return
        }
        res.json(userWishlist);
        return
    } catch (error) {
        next(error);
    }
};
const remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id
        

        await wishListModel.removeFromWishlistValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedProduct = await wishListModel.findOneAndDelete({
            product: id,
            user:req.user?._id
        });
        
        if (!deletedProduct) {
            res.status(401).json({ message: "product Not Found!" });
            return
        }
        res.json({ message: "product removed successfully" });
        return
    } catch (error) {
        next(error);
    }
};
const check = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id

        await wishListModel.removeFromWishlistValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const product = await wishListModel.findOne({ product: id, }).lean();

        if (!product) {
            res.status(200).json({ message: "this product not exist in this user wishlist" });
            return
        }

        res.status(200).json({ message: "this product exist in this user wishlist" });
        return

    } catch (error) {
        next(error);
    }
};


export {
    add,
    getAll,
    check,
    remove,
}

