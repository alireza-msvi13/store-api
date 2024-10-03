import { Request } from "express";
import { IUser } from "./user";

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export { AuthenticatedRequest }