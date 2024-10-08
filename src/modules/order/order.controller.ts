import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth";
import userModel from "../../models/User";
import { IUser } from "../../interfaces/user";
import orderModel from "../../models/Order";



const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { _id, username, phone, email } = req.user as IUser
        const { province, city, address, postalCode, message, products } = req.body;


        await userModel.updateUserValidation({
            province,
            city,
            address,
            postalCode,
            username,
            email,
            phone,
        }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        await orderModel.orderValidation({
            user: _id.toString(),
            products,
            message
        } as any).catch((err) => {
            err.statusCode = 400;
            throw err;
        });


        await userModel.findOneAndUpdate({ _id }, {
            province,
            city,
            address,
            postalCode,
        }, { new: true })


        const order = await orderModel.create({
            user: _id,
            products,
            message
        })


        const newOrder = await orderModel.findOne({ _id: order.id })
            .populate("user")
            .populate("products.productId");



        res.status(201).json(newOrder);
        return
    } catch (error) {
        next(error);
    }
};


const changeStatus = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.params.id
        const { status } = req.body

        await orderModel.changeStatusValidation({
            id,
            status
        }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });


        const order = await orderModel.findByIdAndUpdate(id, {
            status
        }, { new: true })
        


        res.json({ message: `order status changed to ${status}` })
    } catch (error) {
        next(error);
    }


}

export {
    create,
    changeStatus
}