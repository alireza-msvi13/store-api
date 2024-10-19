import { Request, Response, NextFunction } from "express";
import userModel from "../../models/User";
import { AuthenticatedRequest } from "../../interfaces/auth";
import productModel from "../../models/Product";
import orderModel from "../../models/Order";



const info = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userCount = await userModel.find().lean();
        const productCount = await  productModel.find().lean();
        const orderCount = await orderModel.find().lean();
        const users = await userModel.find().sort({ _id: -1 }).lean().limit(5);
        const products = await productModel.find().sort({ _id: -1 }).lean().limit(5);

        const admin = await userModel.findOne({ _id: req.user?._id });

        res.json({
            infos: [
                {
                    count: userCount.length,
                    title: "users",
                },
                {
                    count: productCount.length,
                    title: "products",
                },
                {
                    count: orderCount.length,
                    title: "orders",
                },
            ],
            lastUsers: users,
            lastProducts: products,
            adminName: admin?.username,
        });
    } catch (error) {
        next(error);
    }
};

export {
    info
}