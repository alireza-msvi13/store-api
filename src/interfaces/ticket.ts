import { PopulatedDoc, Document, ObjectId } from "mongoose";
import { IUser } from "./user";


interface ITicket extends Document {
    title: string;
    body: string;
    hasAnswer: boolean;
    parent: PopulatedDoc<Document<ObjectId> & ITicket>;
    isAnswer: boolean;
    user: PopulatedDoc<Document<ObjectId> & IUser>;
}


export {
    ITicket
}