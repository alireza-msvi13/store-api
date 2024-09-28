import { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
  statusCode?: number;
  data?: any;
  inner?: Array<{ path: string; message: string }>;
}

const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  let message = error.message;
  const data = error.data;

  if (error.inner && error.inner.length > 0) message = error.inner[0].message; 

  res.status(status).json({ message, data });
  console.log("<<= ERROR HANDLER =>>");
  console.log(error);
  console.log("<<= END OF ERROR =>>");
};

export default errorHandler;
