import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../models/User";
import { IUser } from "../../interfaces/user";
import { AuthenticatedRequest } from "../../interfaces/auth";
import refreshTokenModel from "../../models/RefreshToken";
import resetPasswordModel from "../../models/ResetPassword";
import nodeMailer from "nodemailer"
import crypto from "crypto"
// * Register

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, phone, fullname, password } = req.body;

        await userModel.registerValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const isUserExists: IUser | null = await userModel.findOne({
            $or: [{ phone }, { email }],
        });


        if (isUserExists) {
            res.status(409).json({ message: "phone or email is duplicate" });
            return
        }

        // const isUserBan = await banUserModel.find({ phone });
        // if (isUserBan.length) {
        //     return res.status(403).json({
        //         message: "this phone number banned!",
        //     });
        // }


        const countOfRegisteredUser = await userModel.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            fullname,
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

        const user: IUser | null = await userModel.findOne({ email });

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
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ message: "RefreshToken is Required Fild" });
            return
        }

        const userID = await refreshTokenModel.verifyToken(refreshToken);

        if (!userID) {
            res.status(401).json({ message: "Invalid or expired token !!" });
            return
        }

        await refreshTokenModel.findOneAndDelete({ token: refreshToken });

        const user = await userModel.findOne({ _id: userID });
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
            return
        }

        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: "20day",
        });

        const newRefreshToken = await refreshTokenModel.createToken(user);


        res.status(200).json({ token: accessToken, refreshToken: newRefreshToken });
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

        const user: IUser | null = await userModel.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User Not Found" });
            return
        }

        const resetToken = crypto.randomBytes(32).toString("hex");


        const resetTokenExpireTime = Date.now() + 1000 * 60 * 15;

        const resetPassword = new resetPasswordModel({
            user: user._id,
            token: resetToken,
            tokenExpireTime: resetTokenExpireTime,
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
            subject: "Reset Password Link For Your Social account",
            html: `
           <h2>Hi, ${user.fullname}</h2>
           <a href=http://localhost:${process.env.PORT}/auth/reset-password/${resetToken}>Reset Password</a>
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
        const { token, password } = req.body;


        await resetPasswordModel.resetPasswordValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const resetPassword = await resetPasswordModel.findOne({
            token,
            tokenExpireTime: { $gt: Date.now() },
        });

        if (!resetPassword) {
            res.status(401).json({ message: "Invalid or expired token !!" });
            return
        }

        const user: IUser | null = await userModel.findOne({ _id: resetPassword.user });

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
