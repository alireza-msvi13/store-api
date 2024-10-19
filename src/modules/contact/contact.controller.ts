import { Request, Response, NextFunction } from "express";
import { contactModel } from "../../models/Contact";
import nodeMailer from "nodemailer"



const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await contactModel.createValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { name, email, phone, message } = req.body;

        const newcontact = await contactModel.create({
            name,
            email,
            phone,
            message,
            answer: 0,
        });

        res.status(201).json(newcontact);
        return
    } catch (error) {
        next(error);
    }
};
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allcontacts = await contactModel.find().sort({ _id: -1 }).lean();
        res.json(allcontacts);
    } catch (error) {
        next(error);
    }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        await contactModel.removeValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedContact = await contactModel.findOneAndDelete({
            _id: id,
        });
        if (!deletedContact) {
            res.status(401).json({ message: "Contact Not Found!" });
            return
        }
        res.json({ message: "message deleted successfully" });
        return
    } catch (error) {
        next(error);
    }
};
const answer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await contactModel.answerValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });

        const { name, email, answer } = req.body;

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
            subject: `Hi, ${name} 🖐`,
            html: `<p>${answer}</p>`
        };

        await contactModel.findOneAndUpdate(
            { email: email },
            {
                answer: 1,
            }
        );

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(500).json({ message: error });
                return
            } else {
                res.json({ message: "Email sent succesfully :))" });
                return
            }
        });
    } catch (error) {
        next(error);
    }
};

export {
    create,
    getAll,
    remove,
    answer
}