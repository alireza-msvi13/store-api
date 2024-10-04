import { PopulatedDoc, Document, ObjectId } from "mongoose";
import { ICategory } from "./category";


interface IProduct extends Document {
    name: string;
    shortname: string;
    brand: string;
    color: string;
    price: number;
    discount: number;
    stock: number;
    cover: string;
    categoryId: PopulatedDoc<Document<ObjectId> & ICategory>;
}


export {
    IProduct
}