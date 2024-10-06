import { PopulatedDoc, Document, ObjectId } from "mongoose";
import { ICategory } from "./category";
import { IUser } from "./user";


interface IArticle extends Document {
    title: string;
    description: string;
    body: string;
    cover?: string;
    shortname: string;
    creator: PopulatedDoc<Document<ObjectId> & IUser>;
    publish?: boolean;
    categoryId: PopulatedDoc<Document<ObjectId> & ICategory>;
}


export {
    IArticle
}