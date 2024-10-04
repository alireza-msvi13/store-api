import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth";
import userModel from "../../models/User";
import bcrypt from "bcryptjs";
import banUserModel from "../../models/Ban";
import { IBaseUserInfo } from "../../interfaces/user";
import refreshTokenModel from "../../models/RefreshToken";

// * get all user

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find().lean();
        res.status(200).json(users);
        return
    } catch (error) {
        next(error);
    }
};

// * edit user info by admin

const editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const { username, email, password, phone, role } = req.body as IBaseUserInfo;

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
        );

        const userObject = updatedUser?.toObject();

        if (userObject) {
            Reflect.deleteProperty(userObject, 'password');
        }

        res.status(200).json({ message: "user info changed successfully", user: userObject });
        return

    } catch (error) {
        next(error);
    }
};

// * update info by user

const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const { username, email, password, phone } = req.body as IBaseUserInfo;

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


        res.json({ user });
        return
    } catch (error) {
        next(error);
    }
};

// * remove user

const removeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params as { id: string };

        await userModel.removeUserValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const deletedUser = await userModel.findOneAndDelete({
            _id: req.params.id,
        });

        if (!deletedUser) {
            res.status(404).json({ message: "User not Found !" });
            return
        }

        res.status(200).json({ message: "User Deleted Successfully" });
        return
    } catch (error) {
        next(error);
    }
};

// * change role

const changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id, role } = req.body as { id: string, role: "ADMIN" | "USER" };


        await userModel.changeUserRoleValidation({ id, role }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });


        await userModel.findByIdAndUpdate(
            { _id: id },
            {
                role: role,
            }
        );

        res.json({ message: `User role changed to ${role} successfully` });
    } catch (error) {
        next(error);
    }
};

// * get user orders

const getUserOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // try {
    //   const userCourses = await courseUserModel
    //     .find({ user: req.user._id })
    //     .populate("course")
    //     .lean();

    //   res.json(userCourses);
    // } catch (error) {
    //   next(error);
    // }
};

// * ban user

const banUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params as { id: string }
        await userModel.removeUserValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const mainUser = await userModel.findOne({ _id: req.params.id }).lean();
        if (!mainUser) {
            res.status(404).json({ message: "User not Found!" });
            return
        }


        const isBanBefore = await banUserModel.findOne({
            $or: [{ phone: mainUser.phone }, { email: mainUser.email }],
        }).lean()

        if (isBanBefore) {
            res.status(409).json({ message: "User is already banned" })
            return
        }

        const banUserResult = await banUserModel.create({ phone: mainUser.phone, email: mainUser.email });

        await refreshTokenModel.findOneAndUpdate({ user: mainUser._id, isValid: true }, { isValid: false },);

        if (banUserResult) {
            res.status(200).json({ message: "User banned successfully" });
            return
        };


    } catch (error) {
        next(error);
    }
};


export {
    getAll,
    editUser,
    updateUser,
    removeUser,
    changeUserRole,
    getUserOrders,
    banUser
}