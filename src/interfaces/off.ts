import { PopulatedDoc, Document, ObjectId } from "mongoose";
import { ICategory } from "./category";
import { IUser } from "./user";
import { IProduct } from "./product";


interface IOff extends Document {
    code:String
    percent:String
    product:PopulatedDoc<Document<ObjectId> & IProduct>
    max:Number
    uses:Number
    creator:PopulatedDoc<Document<ObjectId> & IUser>
}


export {
    IOff
}