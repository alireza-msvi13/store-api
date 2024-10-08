import { PopulatedDoc, Document, ObjectId } from "mongoose";
import { IUser } from "./user";
import { IProduct } from "./product";

interface IOrderProduct {
    productId: PopulatedDoc<Document<ObjectId> & IProduct>;
    count: number;
    color: string;
}

interface IOrder extends Document {
    message?: string;
    user: PopulatedDoc<Document<ObjectId> & IUser>;
    products: IOrderProduct[];
    status: "IN_PROGRESS" | "DISPATCHED" | "COMPLETED";
}


export {
    IOrder
}