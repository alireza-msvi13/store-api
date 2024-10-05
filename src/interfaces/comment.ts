import { PopulatedDoc, Document, ObjectId } from "mongoose";
import { IUser } from "./user";
import { IProduct } from "./product";


interface IComment extends Document {
    body: string;
    product: PopulatedDoc<Document<ObjectId> & IProduct>
    creator: PopulatedDoc<Document<ObjectId> & IUser>
    accept: boolean;
    score: number;
    isAnswer: boolean;
    mainCommendID?: PopulatedDoc<Document<ObjectId> & IComment>
}


export {
    IComment
}