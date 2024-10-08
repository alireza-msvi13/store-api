import { PopulatedDoc, Document, ObjectId } from "mongoose";


interface IMenu extends Document {
    _id: string;
    title: string;
    href: string;
    parent: PopulatedDoc<Document<ObjectId> & IMenu>
    submenus?: IMenu[];
}


export { IMenu }