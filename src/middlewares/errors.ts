import { Request, Response, NextFunction } from 'express';

// Define a custom error interface if necessary
interface CustomError extends Error {
  statusCode?: number;
  data?: any; // You can specify a more specific type for data if needed
  inner?: Array<{ path: string; message: string }>;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  let message: string | Array<{ name: string; message: string }> = error.message;
  const data = error.data;

  // Create an errors array if 'inner' exists
  const errorArr: Array<{ name: string; message: string }> = [];
  if (error.inner) {
    error.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    message = errorArr; // Update message to be the errors array
  }

  res.status(status).json({ message, data });
  console.log("<<= ERROR HANDLER =>>");
  console.log(error);
  console.log("<<= END OF ERROR =>>");
};
