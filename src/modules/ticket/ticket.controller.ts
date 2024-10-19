
import { Request, Response, NextFunction } from "express";
import { ticketModel } from "../../models/Ticket";
import { AuthenticatedRequest } from "../../interfaces/auth";



const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await ticketModel.createValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { title, body } = req.body as { title: string, body: string };

        const ticket = await ticketModel.create({
            title,
            body,
            user: req.user?._id,
        });

        const mainTicket = await ticketModel
            .findOne({ _id: ticket._id })
            .populate("user");

        res.status(201).json(mainTicket);
        return
    } catch (error) {
        next(error);
    }
};
const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const tickets = await ticketModel.find().populate("user").lean();

        if (!tickets) {
            res.status(401).json({ message: "No Ticket Available!" });
            return
        }

        res.json(tickets);
        return
    } catch (error) {
        next(error);
    }
};
const setAnswer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await ticketModel.setAnswerValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { body, ticketId } = req.body;

        const ticket = await ticketModel.findOne({ _id: ticketId }).lean();
        if (!ticket) {
            res.status(401).json({ message: "Ticket Not Found!" });
            return
        }

        const answer = await ticketModel.create({
            title: ticket.title,
            body,
            parent: ticketId,
            user: req.user?._id,
            isAnswer: true,
        });

        await ticketModel.findOneAndUpdate(
            { _id: ticket._id },
            {
                hasAnswer: true,
            }
        );

        res.json(answer);
        return
    } catch (error) {
        next(error);
    }
};
const getAnswer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {


        await ticketModel.getAnswerValidation({ id: req.params.id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const { id } = req.params;

        const answerTicket = await ticketModel.find({ parent: id }).select("body user").populate("user", "username");
        const ticket = await ticketModel.findOne({ _id: id });
        if (!ticket) {
            res.status(401).json({ message: "there is no ticket with this id" });
            return
        }

        res.json({
            ticket: ticket.body,
            answer: answerTicket ? answerTicket : null,
        });
    } catch (error) {
        next(error);
    }
};
const userTickets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const tickets = await ticketModel
            .find({ user: req.user?._id })
            .sort({ _id: -1 })
            .populate("user", "username")
            .lean();

        if (!tickets) {
            res.status(401).json({ message: "No Ticket Available!" });
            return
        }

        res.json(tickets);
        return
    } catch (error) {
        next(error);
    }
};
export {
    create,
    getAll,
    userTickets,
    setAnswer,
    getAnswer
}