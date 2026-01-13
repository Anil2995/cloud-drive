import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user_id: string) => {
    const payload = {
        user: {
            id: user_id
        }
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};
