import { Request, Response } from 'express';
import pool from '../config/db'; // Adjust path if needed (src/config/db.ts)
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtGenerator';

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    try {
        // 1. Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length > 0) {
            res.status(401).json({ msg: 'User already exists!' });
            return;
        }

        // 2. Bcrypt the user password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Enter the new user inside our database
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, bcryptPassword]
        );

        // 4. Generate our jwt token
        const token = generateToken(newUser.rows[0].id);

        res.json({ token, user: newUser.rows[0] });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists (if not, throw error)
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            res.status(401).json({ msg: 'Password or Email is incorrect' });
            return;
        }

        // 2. Check if incoming password is the same as the database password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            res.status(401).json({ msg: 'Password or Email is incorrect' });
            return;
        }

        // 3. Give them the jwt token
        const token = generateToken(user.rows[0].id);

        res.json({ token, user: user.rows[0] });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Current User (Verify)
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await pool.query('SELECT id, name, email, image_url, created_at FROM users WHERE id = $1', [
            req.user.id,
        ]);

        res.json(user.rows[0]);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
