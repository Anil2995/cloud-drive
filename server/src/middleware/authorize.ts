import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('token');

    if (!token) {
        res.status(403).json({ msg: 'Authorization denied' });
        return;
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        req.user = verify.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
