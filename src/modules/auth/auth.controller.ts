import { Request, Response, NextFunction } from "express";
import userModel from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phone, fullname, password } = req.body;

        await userModel.registerValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const isUserExists = await userModel.findOne({
            $or: [{ phone }, { email }],
        });
        

        if (isUserExists) {
            res.status(409).json({ message: "phone or email is duplicate" });
        }

        // const isUserBan = await banUserModel.find({ phone });
        // if (isUserBan.length) {
        //     return res.status(403).json({
        //         message: "this phone number banned!",
        //     });
        // }

        
        const countOfRegisteredUser = await userModel.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 12);

        const accessToken = jwt.sign({ phone }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: "1day",
        });

        const refreshToken = jwt.sign({ phone }, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
            expiresIn: "20day",
        });;


        const user = await userModel.create({
            fullname,
            email,
            phone,
            password: hashedPassword,
            role: countOfRegisteredUser > 0 ? "USER" : "ADMIN",
            refreshToken
        });

        const userObject = user.toObject();

        Reflect.deleteProperty(userObject, "password refreshToken __v");

        res.status(201).json({ user: userObject, accessToken });


    } catch (err) {
        next(err);
    }
};

export { register };
