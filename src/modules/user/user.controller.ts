import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth";
import userModel from "../../models/User";
import bcrypt from "bcryptjs";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
        return
    } catch (error) {
        next(error);
    }
};


const editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { username, email, password, phone, role } = req.body;

        await userModel.editUserValidation({ ...req.body, id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            {
                username,
                email,
                password: hashedPassword,
                phone,
                role,
            },
            { new: true }
        ).lean();

        if (updatedUser) {
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(200).json({ message: "user info changed successfully", user: userWithoutPassword });
            return

        }

        res.status(404).json({ message: "User not found" })
        return

    } catch (error) {
        next(error);
    }
};


const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { username, email, password, phone } = req.body;

        await userModel.updateUserValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await userModel.findOneAndUpdate(
            { _id: req.user?._id },
            {
                username,
                phone,
                email,
                password: hashedPassword,
            },
            {
                new: true
            }
        );

        console.log(user);
        

        res.json({user});
        return 
    } catch (error) {
        next(error);
    }
};

export {
    getAll,
    editUser,
    updateUser
}