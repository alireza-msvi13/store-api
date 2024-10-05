import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../models/User";
import { AuthenticatedRequest } from "../../interfaces/auth";
import refreshTokenModel from "../../models/RefreshToken";
import resetPasswordModel from "../../models/ResetPassword";
import nodeMailer from "nodemailer"
import crypto from "crypto"
import banUserModel from "../../models/Ban";
import { IBaseUserInfo } from "../../interfaces/user";


// * Register

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, phone, username, password } = req.body as IBaseUserInfo;

        await userModel.registerValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const isUserExists = await userModel.findOne({
            $or: [{ phone }, { email }],
        }).lean();


        if (isUserExists) {
            res.status(409).json({ message: "phone or email is duplicate" });
            return
        }

        const isUserBan = await banUserModel.find({ $or: [{ phone }, { email }] }).lean();
        if (isUserBan.length) {
            res.status(403).json({
                message: "this phone number or email banned!",
            });
            return
        }


        const countOfRegisteredUser = await userModel.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            username,
            email,
            phone,
            password: hashedPassword,
            role: countOfRegisteredUser > 0 ? "USER" : "ADMIN",
        });

        const userObject = user.toObject();

        Reflect.deleteProperty(userObject, "password");


        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: "10day",
        });

        const refreshToken = await refreshTokenModel.createToken(user);


        res.status(201).json({ message: "Signed Up was successfully", user: userObject, token: accessToken, refreshToken: refreshToken });
        return


    } catch (err) {
        next(err);
    }
};

// * Login

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { email, password } = req.body as { email: string; password: string };

        await userModel.loginValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const user = await userModel.findOne({ email }).lean();

        if (!user) {
            res.status(401).json({ message: "User Not Found" });
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "password is not correct" });
            return
        }


        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: "10day",
        });

        const refreshToken = await refreshTokenModel.createToken(user);


        await userModel.findOneAndUpdate({ email }, { refreshToken }, { new: true });

        res.status(200).json({ message: "Signed In was successfully", token: accessToken, refreshToken: refreshToken });
        return

    } catch (err) {
        next(err);
    }
};

// * get user info

const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // const userCourses = await courseUserModel
        //     .find({ user: req.user._id })
        //     .populate("course");

        // const courses = [];

        // for (const userCourse of userCourses) {
        //     courses.push(userCourse.course);
        // }

        // const adminNotifications = await notificationsModel.find({
        //     admin: req.user._id,
        // });

        // const notifications = [];

        // for (const adminNotification of adminNotifications) {
        //     if (adminNotification.see === 0) {
        //         notifications.push({
        //             msg: adminNotification.msg,
        //             _id: adminNotification._id,
        //         });
        //     }
        // }

        // return res.json({ ...req.user, courses, notifications });

        // console.log(req.user);

        res.json({ message: "user info", user: req.user })
        return
    } catch (error) {
        next(error);
    }
};

// * refreshToken

const refreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body as { refreshToken: string };

        if (!refreshToken) {
            res.status(400).json({ message: "RefreshToken is Required Fild" });
            return
        }

        const userID = await refreshTokenModel.verifyToken(refreshToken);

        if (!userID) {
            res.status(401).json({ message: "Invalid or expired RefreshToken !!" });
            return
        }

        const user = await userModel.findOne({ _id: userID }).lean();
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
            return
        }

        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: "10day",
        });

        res.status(200).json({ token: accessToken });
        return

    } catch (err) {
        next(err);
    }
};


// * forgot password

const forgetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body as { email: string };

        await resetPasswordModel.forgotPasswordValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const user = await userModel.findOne({ email }).lean();
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
            return
        }

        const code = Math.floor(Math.random() * 99999);


        const resetCodeExpireTime = Date.now() + 1000 * 60 * 10;

        const resetPassword = new resetPasswordModel({
            user: user._id,
            code,
            codeExpireTime: resetCodeExpireTime,
        });

        resetPassword.save();

        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password Code For Your account",
            html: `
            <h2> Hi, ${user.username} 🖐</h2>
            <h3>your code is : ${code}</h3>
            `,
        };

        transporter.sendMail(mailOptions);


        res.status(200).json({ message: "Recovery Email Send Successfully" })
        return

    } catch (err) {
        next(err);
    }
}


// * Reset Password

const resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code, password } = req.body as { code: string, password: string };


        await resetPasswordModel.resetPasswordValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        
        const resetPassword = await resetPasswordModel.findOne({
            code,
            codeExpireTime: { $gt: Date.now() },
        }).lean();


        if (!resetPassword) {
            res.status(401).json({ message: "Invalid or expired code !!" });
            return
        }

        const user = await userModel.findOne({ _id: resetPassword.user }).lean();

        if (!user) {
            res.status(401).json({ message: "User Not Found" });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.findOneAndUpdate(
            { _id: user._id },
            {
                password: hashedPassword,
            }
        );

        await resetPasswordModel.findOneAndDelete({ _id: resetPassword._id });

        res.status(401).json({ message: "Password reset successfully" });
        return

    } catch (err) {
        next(err);
    }
}




export { register, login, getMe, refreshToken, forgetPassword, resetPassword };
