import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, '..', '..' , 'public', 'covers'));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const sha256 = crypto.createHash('SHA256');
    const hashedFileName = sha256.update(file.originalname).digest('hex');
    cb(null, hashedFileName + path.extname(file.originalname));
  },
});

export default storage;
