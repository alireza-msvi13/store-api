import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth";

const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === "ADMIN";

  if (isAdmin) return next();

  res.status(403).json({ message: "this route is accessible only for admins." });
  return
};


export default isAdmin