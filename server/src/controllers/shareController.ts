import { Request, Response } from 'express';
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

// Share with user
export const shareWithUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { resource_type, resource_id, grantee_email, role } = req.body;
        const created_by = req.user?.id;

        // Find grantee user
        const grantee = await pool.query('SELECT id FROM users WHERE email = $1', [grantee_email]);

        if (grantee.rows.length === 0) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const grantee_user_id = grantee.rows[0].id;

        // Check if already shared
        const existing = await pool.query(
            'SELECT * FROM shares WHERE resource_type = $1 AND resource_id = $2 AND grantee_user_id = $3',
            [resource_type, resource_id, grantee_user_id]
        );

        if (existing.rows.length > 0) {
            // Update existing share
            const updated = await pool.query(
                'UPDATE shares SET role = $1 WHERE id = $2 RETURNING *',
                [role, existing.rows[0].id]
            );
            res.json(updated.rows[0]);
        } else {
            // Create new share
            const share = await pool.query(
                'INSERT INTO shares (resource_type, resource_id, grantee_user_id, role, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [resource_type, resource_id, grantee_user_id, role, created_by]
            );
            res.json(share.rows[0]);
        }
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create public link
export const createPublicLink = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { resource_type, resource_id, role } = req.body;
        const created_by = req.user?.id;
        const link_id = uuidv4();

        const link = await pool.query(
            'INSERT INTO link_shares (link_id, resource_type, resource_id, role, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [link_id, resource_type, resource_id, role || 'viewer', created_by]
        );

        res.json({ linkId: link_id, ...link.rows[0] });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get shares for a resource
export const getShares = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { resource_type, resource_id } = req.query;

        const shares = await pool.query(
            `SELECT s.*, u.email, u.name 
             FROM shares s 
             JOIN users u ON s.grantee_user_id = u.id 
             WHERE s.resource_type = $1 AND s.resource_id = $2`,
            [resource_type, resource_id]
        );

        res.json(shares.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Remove share
export const removeShare = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM shares WHERE id = $1', [id]);
        res.json({ msg: 'Share removed' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
